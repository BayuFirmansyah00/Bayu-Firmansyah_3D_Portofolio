import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/useLoading";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../utils/progress";
import { disposeCharTimelines } from "../utils/GsapScroll";
import { prefersReducedMotion } from "../utils/motion";

/**
 * Recursively dispose GPU resources (geometry, materials, textures)
 * held by every mesh under `root`.
 */
const disposeObjectResources = (root: THREE.Object3D) => {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material as unknown as Record<string, unknown>).forEach(
        (value) => {
          const texture = value as THREE.Texture | undefined;
          if (texture && texture.isTexture) {
            texture.dispose();
          }
        }
      );
      material.dispose();
    });
  });
};

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const canvasNode = canvasDiv.current;
    if (!canvasNode) return;

    // Lifecycle flags / handles so every timer, listener and GPU
    // resource created below can be released on unmount.
    let disposed = false;
    let frameId: number | undefined;
    let introTimeout: number | undefined;
    let touchDebounce: number | undefined;
    let touchMoveAttached = false;
    let touchElement: HTMLElement | null = null;
    let cleanupHover: (() => void) | undefined;
    let cleanupTouchEnd: (() => void) | undefined;
    let disposeAnimations: (() => void) | undefined;
    let onResize: (() => void) | undefined;

    // Visitors who ask for reduced motion still get the whole page: the model
    // loads and the hero stays intact, but the character never follows the
    // pointer (it is hidden by CSS) and the render loop stops after a single
    // frame instead of running for the rest of the session.
    const reducedMotion = prefersReducedMotion();

    const rect = canvasNode.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasNode.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    // On desktop the character shares the page with the editorial content, so
    // it is rendered ~36% smaller (0.7 instead of 1.1) to stay inside its
    // reserved lane. On tablet it only lives inside the hero, where the
    // original framing already fits.
    camera.zoom = window.innerWidth > 1024 ? 0.7 : 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        // Component unmounted while the model was decrypting/loading:
        // free its resources immediately instead of wiring anything up.
        if (disposed) {
          if (gltf) disposeObjectResources(gltf.scene);
          progress.clear();
          return;
        }
        if (!gltf) return;
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          cleanupHover = animations.hover(gltf, hoverDivRef.current);
        }
        disposeAnimations = animations.dispose;
        mixer = animations.mixer;
        const loadedCharacter = gltf.scene;
        setChar(loadedCharacter);
        scene.add(loadedCharacter);
        headBone = loadedCharacter.getObjectByName("spine006") || null;
        screenLight = loadedCharacter.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          if (disposed) return;
          introTimeout = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
        onResize = () =>
          handleResize(renderer, camera, canvasDiv, loadedCharacter);
        window.addEventListener("resize", onResize);
      })
      .catch((error) => {
        console.error("Failed to load character:", error);
      });

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.08, y: 0.12 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      touchDebounce = window.setTimeout(() => {
        touchElement = element;
        element?.addEventListener("touchmove", onTouchMove);
        touchMoveAttached = true;
      }, 200);
    };

    const onTouchEnd = () => {
      cleanupTouchEnd = handleTouchEnd(
        (x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        }
      );
    };

    const landingDiv = document.getElementById("landingDiv");
    if (!reducedMotion) {
      document.addEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
    }

    const animate = () => {
      if (disposed) return;
      if (reducedMotion) {
        // Nothing to animate — draw one frame and stop requesting frames.
        renderer.render(scene, camera);
        return;
      }
      frameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        if (screenLight) light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;

      // Stop the render loop.
      if (frameId !== undefined) cancelAnimationFrame(frameId);

      // Stop every timer created by this effect.
      if (introTimeout !== undefined) window.clearTimeout(introTimeout);
      if (touchDebounce !== undefined) window.clearTimeout(touchDebounce);
      progress.clear();

      // Detach every listener with the same references used to attach.
      cleanupHover?.();
      cleanupTouchEnd?.();
      if (onResize) window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      if (touchMoveAttached && touchElement) {
        touchElement.removeEventListener("touchmove", onTouchMove);
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }

      // Release GSAP timelines/intervals tied to this scene.
      disposeCharTimelines();

      // Release Three.js resources: animation mixer, env map, lights,
      // geometries, materials, textures, and finally the GL context.
      disposeAnimations?.();
      light.dispose();
      disposeObjectResources(scene);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

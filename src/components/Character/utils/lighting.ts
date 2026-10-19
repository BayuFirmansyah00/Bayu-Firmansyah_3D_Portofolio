import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  let envTexture: THREE.Texture | null = null;
  let lightTween: gsap.core.Tween | null = null;
  let directionalTween: gsap.core.Tween | null = null;
  let rimTween: gsap.core.Tween | null = null;
  let disposed = false;

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      // The HDR may arrive after unmount; dispose it instead of leaking.
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      envTexture = texture;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: THREE.Object3D | null) {
    const material = (screenLight as THREE.Mesh | null)
      ?.material as THREE.MeshStandardMaterial | undefined;
    if (!material) {
      pointLight.intensity = 0;
      return;
    }
    if (material.opacity > 0.9) {
      pointLight.intensity = (material.emissiveIntensity ?? 0) * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    lightTween = gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    directionalTween = gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    rimTween = gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  /** Kill light tweens and release GPU resources held by the lighting rig. */
  function dispose() {
    disposed = true;
    lightTween?.kill();
    directionalTween?.kill();
    rimTween?.kill();
    lightTween = directionalTween = rimTween = null;

    directionalLight.shadow.map?.dispose();
    pointLight.shadow.map?.dispose();
    scene.remove(directionalLight, pointLight);
    directionalLight.dispose();
    pointLight.dispose();

    if (envTexture) {
      if (scene.environment === envTexture) scene.environment = null;
      envTexture.dispose();
      envTexture = null;
    }
  }

  return { setPointLight, turnOnLights, dispose };
};

export default setLighting;

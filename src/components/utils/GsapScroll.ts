import * as THREE from "three";
import gsap from "gsap";
import { prefersReducedMotion } from "./motion";

// Module-level handles so repeated calls (model reload, window resize)
// and unmount cleanup never leak intervals or orphaned timelines.
let flickerInterval: ReturnType<typeof setInterval> | undefined;
let flickerTimeline: gsap.core.Timeline | null = null;
let managedTimelines: gsap.core.Timeline[] = [];

/**
 * Kill every timeline and interval created by setCharTimeline /
 * setAllTimeline. Safe to call repeatedly (e.g. on resize, where old
 * ScrollTriggers were already killed, or on component unmount).
 */
export function disposeCharTimelines() {
  if (flickerInterval !== undefined) {
    clearInterval(flickerInterval);
    flickerInterval = undefined;
  }
  flickerTimeline?.kill();
  flickerTimeline = null;
  managedTimelines.forEach((timeline) => timeline.kill());
  managedTimelines = [];
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  // Clear resources from any previous invocation before rebuilding.
  disposeCharTimelines();

  let intensity: number = 0;
  flickerInterval = setInterval(() => {
    intensity = Math.random();
  }, 200);
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  // Held in an object (not bare locals) so TypeScript does not narrow
  // them to `null` after assignment inside the forEach callback.
  const modelRefs: {
    screenLight: THREE.Mesh | null;
    monitor: THREE.Mesh | null;
  } = { screenLight: null, monitor: null };
  character?.children.forEach((object) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        const childMesh = child as THREE.Mesh;
        const childMaterial = childMesh.material as THREE.MeshStandardMaterial;
        if (!childMaterial) return;
        childMaterial.transparent = true;
        childMaterial.opacity = 0;
        if (childMaterial.name === "Material.027") {
          modelRefs.monitor = childMesh;
          childMaterial.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (!material) return;
      material.transparent = true;
      material.opacity = 0;
      material.emissive.set("#C8BFFF");
      flickerTimeline = gsap
        .timeline({ repeat: -1, repeatRefresh: true })
        .to(material, {
          emissiveIntensity: () => intensity * 8,
          duration: () => Math.random() * 0.6,
          delay: () => Math.random() * 0.1,
        });
      modelRefs.screenLight = mesh;
    }
  });
  const neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "none" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      // The following targets depend on specific nodes of the current
      // model; skip them gracefully if a future model no longer has them.
      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }
      if (modelRefs.monitor?.material) {
        tl2.to(
          modelRefs.monitor.material,
          { opacity: 1, duration: 0.8, delay: 3.2 },
          0
        );
        tl2.fromTo(
          modelRefs.monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        );
      }
      if (modelRefs.screenLight?.material) {
        tl2.to(
          modelRefs.screenLight.material,
          { opacity: 1, duration: 0.8, delay: 4.5 },
          0
        );
      }

      // NOTE: the Skills list is deliberately not part of this timeline any
      // more. It used to be toggled with `display: none -> flex` from here,
      // which made the section depend on the 3D model having loaded (and
      // left it invisible if the model ever failed). WhatIDo.tsx now owns a
      // light, one-shot reveal for it instead.
      tl2.fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
        0.3
      );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);

      // The character follows the scroll, so it steps aside before the
      // content-heavy sections: it is fully faded out while the Skills
      // section is still entering, and it only becomes fully opaque again
      // when scrolling back into the hero/about range. This keeps titles,
      // copy, skill lists, project cards and the contact band free of the
      // 3D layer.
      const charExit = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".whatIDO",
            start: "top 88%",
            end: "top 32%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          ".character-model",
          { opacity: 1 },
          { opacity: 0, ease: "none" }
        );
      managedTimelines.push(charExit);
    }
  }

  // Register unconditionally so disposeCharTimelines() always reaches
  // them, even if the viewport crossed the 1024px boundary on resize.
  managedTimelines.push(tl1, tl2, tl3);
}

export function setAllTimeline() {
  // The career rule, dots and boxes already rest at their finished state in
  // CSS, so visitors who prefer reduced motion simply skip the scrubbed
  // reveal instead of watching the timeline draw itself in.
  if (prefersReducedMotion()) return;

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "0%" },
      { maxHeight: "100%", duration: 1, ease: "none" },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }

  managedTimelines.push(careerTimeline);
}

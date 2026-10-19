import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { lenis } from "../Navbar";
import { prefersReducedMotion } from "./motion";

// Infinite timelines created by LoopText keep running (and keep the GSAP
// registry alive) even after the landing section unmounts — e.g. when
// navigating to /myworks. Track them so they can be killed on unmount.
let infiniteTimelines: gsap.core.Timeline[] = [];

/**
 * Kill the looping landing-text timelines created by initialFX().
 * Called when the landing page unmounts.
 */
export function disposeInitialFX() {
  infiniteTimelines.forEach((timeline) => timeline.kill());
  infiniteTimelines = [];
}

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0]?.classList.add("main-active");

  // Users who ask for reduced motion still get the full page, but the
  // endless text loops are skipped and reveals become instant.
  const reducedMotion = prefersReducedMotion();
  const revealDuration = reducedMotion ? 0.01 : 1.2;
  const softReveal = (duration: number) => (reducedMotion ? 0.01 : duration);

  gsap.to("body", {
    backgroundColor: "#f5f2eb",
    duration: 0.5,
    delay: 1,
  });

  const selectors = [".landing-info h3", ".landing-intro h2", ".landing-intro h1"];
  const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));
  const landingText = new TextSplitter(elements, {
    type: "chars,lines",
    linesClass: "split-line",
  });
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: revealDuration,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingText2 = new TextSplitter(".landing-h2-info", TextProps);
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: revealDuration,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: revealDuration,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  // Hero choreography, in reading order: eyebrow → statement → supporting
  // copy → portrait → calls to action. Each piece arrives on its own beat so
  // nothing ever stacks on top of the headline while it is being read.
  gsap.fromTo(
    ".landing-intro .eyebrow",
    { opacity: 0, y: reducedMotion ? 0 : 16 },
    {
      opacity: 1,
      y: 0,
      duration: softReveal(0.7),
      ease: "power2.out",
      delay: 0.15,
      // Hand the element back to the stylesheet once it has arrived, so
      // inline transforms never override the CSS hover states.
      clearProps: "transform",
    }
  );
  gsap.fromTo(
    ".landing-lede",
    { opacity: 0, y: reducedMotion ? 0 : 24 },
    {
      opacity: 1,
      y: 0,
      duration: softReveal(0.8),
      ease: "power2.out",
      delay: 0.9,
      clearProps: "transform",
    }
  );
  gsap.fromTo(
    ".landing-portrait",
    {
      opacity: 0,
      y: reducedMotion ? 0 : 44,
      scale: reducedMotion ? 1 : 0.985,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: softReveal(1),
      ease: "power3.out",
      delay: 0.5,
      clearProps: "transform",
    }
  );
  // The buttons land once the headline has had time to read.
  gsap.fromTo(
    ".landing-actions .btn",
    { opacity: 0, y: reducedMotion ? 0 : 18 },
    {
      opacity: 1,
      y: 0,
      duration: softReveal(0.8),
      ease: "power2.out",
      delay: 1.2,
      stagger: 0.1,
      clearProps: "transform",
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: revealDuration,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText3 = new TextSplitter(".landing-h2-info-1", TextProps);
  const landingText4 = new TextSplitter(".landing-h2-1", TextProps);
  const landingText5 = new TextSplitter(".landing-h2-2", TextProps);

  if (!reducedMotion) {
    LoopText(landingText2, landingText3);
    LoopText(landingText4, landingText5);
  }
}

function LoopText(Text1: TextSplitter, Text2: TextSplitter) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  infiniteTimelines.push(tl);
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextSplitter } from "../../utils/textSplitter";
import { prefersReducedMotion } from "./motion";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: TextSplitter;
}

gsap.registerPlugin(ScrollTrigger);

// Registered once: previously every call to setSplitText() (i.e. every
// window resize) attached ANOTHER "refresh" listener, multiplying work
// and leaking listeners for the lifetime of the page.
let refreshListenerAttached = false;

// Animations created by the most recent run, kept so the page can release
// them on unmount instead of leaving ScrollTriggers pointing at nodes that
// no longer exist (e.g. after navigating to /myworks).
let createdAnimations: gsap.core.Animation[] = [];

/** Kill every split animation and restore the original text markup. */
function revertSplits() {
  document.querySelectorAll<ParaElement>(".para, .title").forEach((node) => {
    if (node.anim) {
      node.anim.kill();
      node.anim = undefined;
    }
    if (node.split) {
      node.split.revert();
      node.split = undefined;
    }
  });
}

/**
 * Release the split-text animations owned by the landing page. Called from
 * MainContainer's cleanup so route changes do not leak ScrollTriggers.
 */
export function disposeSplitText() {
  createdAnimations.forEach((animation) => animation.kill());
  createdAnimations = [];
  revertSplits();
}

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  // Narrow viewports keep the natural reading rhythm, and visitors who ask
  // for reduced motion get plain, always-visible copy instead of a
  // word-by-word reveal.
  if (window.innerWidth < 900 || prefersReducedMotion()) {
    createdAnimations = [];
    revertSplits();
    return;
  }

  createdAnimations = [];
  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    para.split = new TextSplitter(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
    createdAnimations.push(para.anim);
  });
  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new TextSplitter(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
    createdAnimations.push(title.anim);
  });

  if (!refreshListenerAttached) {
    refreshListenerAttached = true;
    ScrollTrigger.addEventListener("refresh", () => setSplitText());
  }
}

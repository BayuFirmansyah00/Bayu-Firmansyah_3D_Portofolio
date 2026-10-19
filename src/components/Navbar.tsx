import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { prefersReducedMotion } from "./utils/motion";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // Smooth scrolling is motion. Visitors who ask for less of it keep the
    // browser's native scroll, and every anchor below falls back to a plain
    // jump instead of a Lenis tween.
    const reducedMotion = prefersReducedMotion();

    let rafId: number | undefined;
    if (!reducedMotion) {
      // Initialize Lenis smooth scroll
      lenis = new Lenis({
        duration: 1.7,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.7,
        touchMultiplier: 2,
        infinite: false,
      });

      // Start paused until the loading curtain lifts.
      lenis.stop();

      // Handle smooth scroll animation frame; cancellable on unmount.
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    // Every in-page anchor — navbar links, hero calls to action, section
    // links — shares this one handler, so smooth scrolling never fights the
    // browser's native jump to the same target.
    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]'
    );
    const linkHandlers: Array<[HTMLAnchorElement, (e: Event) => void]> = [];
    anchors.forEach((element) => {
      const handler = (e: Event) => {
        // Skip link harus memakai perilaku browser (memindahkan fokus ke
        // tujuan), bukan scroll halus — supaya tab berikutnya lanjut tepat
        // dari konten utama.
        if (element.classList.contains("skip-link")) return;
        const hash =
          element.getAttribute("data-href") ?? element.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;
        e.preventDefault();
        // A pinned section (the project strip) travels with ScrollTrigger, so
        // its live start position is the only reliable destination.
        const trigger = ScrollTrigger.getById(hash.slice(1));
        const position =
          trigger && Number.isFinite(trigger.start)
            ? trigger.start
            : target.getBoundingClientRect().top + window.scrollY;
        if (lenis) {
          lenis.scrollTo(position, { offset: 0, duration: 1.5 });
        } else {
          window.scrollTo({
            top: position,
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      };
      linkHandlers.push([element, handler]);
      element.addEventListener("click", handler);
    });

    // Handle resize
    const onResize = () => {
      lenis?.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      linkHandlers.forEach(([element, handler]) =>
        element.removeEventListener("click", handler)
      );
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Bayu Firmansyah
        </a>
        <nav aria-label="Navigasi utama">
          <ul>
            <li>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#work" href="#work">
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </ul>
        </nav>
        <a
          href="mailto:bayufirr27@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          bayufirr27@gmail.com
        </a>
      </div>

      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

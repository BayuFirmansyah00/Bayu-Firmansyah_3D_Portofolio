import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "./utils/motion";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    const reducedMotion = prefersReducedMotion();

    // Entrance reveal: head plus cards arrive once, before the strip starts
    // travelling. Kept out of the pinned timeline so the two never overlap.
    let intro: gsap.core.Timeline | undefined;
    if (!reducedMotion) {
      intro = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top 78%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      intro
        .fromTo(
          [".work-head .eyebrow", ".work-head .section-title"],
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform",
          }
        )
        .fromTo(
          ".work-box",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power2.out",
            clearProps: "transform",
          },
          "-=0.35"
        );
    }

    // Mobile keeps its native, stacked layout, and reduced-motion visitors
    // use that same layout (matched by the media query in Work.css) instead
    // of a pinned horizontal pan.
    if (window.innerWidth <= 768 || reducedMotion) {
      return () => {
        intro?.kill();
      };
    }

    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    // Which card currently holds the focus. Mapped from the pin's own
    // progress (no extra scroll listener and no per-frame layout reads), so
    // each project gets its turn and the closing CTA is the last one lit.
    const boxes = Array.from(
      document.querySelectorAll<HTMLElement>(".work-box")
    );
    let currentIndex = -1;
    const markCurrent = (index: number) => {
      if (index === currentIndex) return;
      currentIndex = index;
      boxes.forEach((box, i) =>
        box.classList.toggle("is-current", i === index)
      );
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const last = boxes.length - 1;
          if (last < 1) return;
          markCurrent(Math.min(last, Math.round(self.progress * last)));
        },
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    markCurrent(0);

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      intro?.kill();
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
      boxes.forEach((box) => box.classList.remove("is-current"));
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-head">
          <span className="eyebrow">Selected projects</span>
          <h2 className="section-title">
            Selected <em>work</em>
          </h2>
        </div>
        <div className="work-flex">
          {config.projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <article className="work-box" key={project.id}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>0{index + 1}</h3>
                    <div>
                      <h4>{project.title}</h4>
                      <p className="work-category">{project.category}</p>
                    </div>
                  </div>
                  <p className="work-description">{project.description}</p>
                  <div className="work-meta">
                    {project.technologies && (
                      <p className="work-tech">
                        <span>Stack</span>
                        {project.technologies}
                      </p>
                    )}
                    {project.roleGalleries && (
                      <Link
                        to={`/myworks/${project.id}`}
                        className="work-detail-link"
                        data-cursor="disable"
                      >
                        Lihat studi kasus →
                      </Link>
                    )}
                  </div>
                </div>
                <WorkImage image={project.image} alt={project.title} />
              </article>
            ))}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Masih ada lagi.</h3>
              <p>
                Daftar lengkap delapan proyek — dengan peran, periode, dan
                kategori masing-masing.
              </p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                Lihat semua proyek →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;

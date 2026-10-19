import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/WhatIDo.css";
import { config } from "../config";
import { prefersReducedMotion } from "./utils/motion";

gsap.registerPlugin(ScrollTrigger);

const WhatIDo = () => {
  useEffect(() => {
    // Light, one-shot reveal for the six skill groups and the rules that
    // separate them. It lives here (not in the character timelines) so the
    // list is always reachable: on mobile, on a failed 3D asset, and after
    // scrolling back up. Nothing is hidden with `display`, so the content
    // stays readable even if the animation never runs.
    if (prefersReducedMotion()) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top 68%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    timeline
      .fromTo(
        [".what-box:first-child .eyebrow", ".what-lede"],
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        }
      )
      .fromTo(
        ".what-content",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.3"
      )
      .fromTo(
        ".what-group",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.45"
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="whatIDO" id="skills">
      <div className="what-box">
        <span className="eyebrow">Skills</span>
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            &nbsp;I<span className="do-h2"> DO</span>
          </div>
        </h2>
        <p className="what-lede">
          Enam area kerja, dari aplikasi mobile sampai integrasi perangkat —
          tanpa skor atau rating, hanya hal yang benar-benar saya pakai.
        </p>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          {config.skills.cards.map((card, cardIndex) => (
            <div className="what-content" key={cardIndex}>
              <div className="what-content-in">
                <h3>{card.title}</h3>
                <h4>{card.description}</h4>
                <p>{card.details}</p>
                {card.groups.map((group, groupIndex) => (
                  <div className="what-group" key={groupIndex}>
                    <h5>{group.label}</h5>
                    <div className="what-content-flex">
                      {group.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="what-tags">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

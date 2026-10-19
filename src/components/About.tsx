import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";
import { config } from "../config";
import { prefersReducedMotion } from "./utils/motion";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useEffect(() => {
    // The paragraph and title already arrive word by word through
    // setSplitText(); this small one-shot timeline only covers the two
    // pieces that had no entrance of their own — the eyebrow and the
    // education facts — so it can never fight the existing reveal.
    if (prefersReducedMotion()) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 72%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    timeline
      .fromTo(
        ".about-me .eyebrow",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform",
        }
      )
      .fromTo(
        ".about-fact",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.25"
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <span className="eyebrow">About</span>
        <h3 className="title">{config.about.title}</h3>
        <p className="para">{config.about.description}</p>

        <dl className="about-facts">
          <div className="about-fact">
            <dt>Pendidikan</dt>
            <dd>{config.education.degree}</dd>
          </div>
          <div className="about-fact">
            <dt>Kampus</dt>
            <dd>{config.education.institution}</dd>
          </div>
          <div className="about-fact">
            <dt>Periode</dt>
            <dd>{config.education.period}</dd>
          </div>
          <div className="about-fact">
            <dt>IPK</dt>
            <dd className="about-fact-number">{config.education.gpa}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default About;

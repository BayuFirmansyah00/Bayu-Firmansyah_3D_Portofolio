import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { useEffect } from "react";
import { config } from "../config";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    // Per-icon rAF handles and document listeners so everything can be
    // released on unmount (forEach discards any return value, so the
    // previous inner cleanup never ran and targeted the wrong element).
    const rafIds: number[] = [];
    const cleanups: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item, index) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      // One slot per icon; reassigned every frame so the array stays
      // fixed-size instead of growing on every animation frame.
      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        rafIds[index] = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      cleanups.push(() =>
        document.removeEventListener("mousemove", onMouseMove)
      );

      updatePosition();
    });

    return () => {
      rafIds.forEach((id) => cancelAnimationFrame(id));
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href={config.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Bayu Firmansyah (tab baru)"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Bayu Firmansyah (tab baru)"
          >
            <FaLinkedinIn />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;

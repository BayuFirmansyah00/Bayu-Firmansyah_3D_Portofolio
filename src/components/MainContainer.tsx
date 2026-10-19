import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import OtherProjects from "./OtherProjects";
import setSplitText, { disposeSplitText } from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  // The 3D character is rendered from tablet upwards (>768px). Below that
  // breakpoint the hero falls back to the single-column text + portrait
  // layout (see Landing.css), the character is hidden with `display: none`
  // and LoadingProvider skips the loading curtain entirely — the curtain
  // waits for the 3D asset, so both conditions must stay in sync.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth <= 768
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsMobile(window.innerWidth <= 768);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      // Release the split-text reveals that point at this page's DOM before
      // those nodes disappear on a route change.
      disposeSplitText();
      // Kill the looping landing-text timelines (repeat: -1) created by
      // initialFX; they would otherwise outlive this page on route change.
      import("./utils/initialFX").then((module) =>
        module.disposeInitialFX?.()
      );
    };
  }, []);

  return (
    <div className="container-main">
      <a
        className="skip-link"
        href="#konten-utama"
        data-cursor="disable"
        onClick={(event) => {
          // Pindahkan fokus eksplisit ke <main> agar tab berikutnya mulai
          // dari konten utama, bukan dari navbar. preventDefault supaya
          // hasilnya sama untuk jalur keyboard maupun klik mouse.
          event.preventDefault();
          document.getElementById("konten-utama")?.focus();
        }}
      >
        Lewati ke konten utama
      </a>
      <Cursor />
      <Navbar />
      <SocialIcons />
      {!isMobile && children}
      <Landing />
      <About />
      <WhatIDo />
      <Career />
      <Work />
      <OtherProjects />
      <TechStackNew />
      <CallToAction />
      <Contact />
    </div>
  );
};

export default MainContainer;

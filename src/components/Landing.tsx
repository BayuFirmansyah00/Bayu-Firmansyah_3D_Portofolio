import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div
        className="landing-container"
        id="konten-utama"
        tabIndex={-1}
      >
          {/* Left column — the statement */}
          <div className="landing-intro">
            <span className="eyebrow">The Developer&rsquo;s Desk</span>
            <h2>{config.developer.fullName}</h2>
            <h1>Ideas become products.</h1>
          </div>

          {/* Left column, continued — role + kinetic focus ticker */}
          <div className="landing-info">
            <h3>{config.developer.title}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{config.developer.focus[0]}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{config.developer.focus[1]}</div>
            </h2>
            <p className="landing-lede">{config.developer.tagline}</p>
            <div className="landing-actions">
              <a href="#work" className="btn btn-solid" data-cursor="disable">
                Lihat Proyek
              </a>
              <a href="#contact" className="btn" data-cursor="disable">
                Hubungi Saya
              </a>
            </div>
          </div>

          {/* Right column — editorial portrait */}
          <figure className="landing-portrait">
            <div className="landing-portrait-frame">
              <img
                src="/images/foto_profil_bayu.webp"
                alt="Bayu Firmansyah"
                loading="eager"
              />
            </div>
            <figcaption>
              <span>Bayu Firmansyah</span>
              <span>{config.social.location}</span>
            </figcaption>
          </figure>
        </div>

        {/* Centre column stays clear for the Phase 3 3D object. */}
        {children}
      </div>
    </>
  );
};

export default Landing;

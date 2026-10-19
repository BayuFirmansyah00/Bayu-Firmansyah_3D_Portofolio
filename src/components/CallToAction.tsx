import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-inner">
        <span className="eyebrow">Get in touch</span>
        <h2 className="section-title">
          Let&rsquo;s build <em>something.</em>
        </h2>
        <p className="cta-lede">
          Proyek, kolaborasi, atau sekadar bertanya soal Flutter dan IoT —
          silakan mulai dari mana saja.
        </p>
        <div className="cta-buttons">
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-hire"
            data-cursor="disable"
          >
            Hire Me →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;

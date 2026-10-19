import "./styles/Career.css";
import { config } from "../config";

const getDisplayYear = (period: string) => {
  const years = period.match(/\d{4}/g);
  if (years && years.length) return years[years.length - 1];
  return period;
};

const Career = () => {
  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <div className="career-head">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            Internship <em>&amp; practice</em>
          </h2>
          <p className="career-lede">
            Pengalaman profesional sejauh ini berjalan lewat satu program
            magang — proyek akademik ditampilkan terpisah di bagian lain.
          </p>
        </div>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.experiences.map((exp, index) => (
            <article className="career-info-box" key={index}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <div className="career-when">
                  <h3>{getDisplayYear(exp.period)}</h3>
                  <span className="career-period">{exp.period}</span>
                  {exp.status && (
                    <span className="career-status">
                      <i aria-hidden="true"></i>
                      {exp.status}
                    </span>
                  )}
                </div>
              </div>
              <p>{exp.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;

import "./styles/OtherProjects.css";
import { config } from "../config";

const OtherProjects = () => {
  const others = config.projects.filter((project) => !project.featured);

  return (
    <section className="other-section" id="other-projects">
      <div className="other-container section-container">
        <div className="other-head">
          <span className="eyebrow">Other projects</span>
          <h2 className="section-title">
            More <em>work</em>
          </h2>
          <p className="other-lede">
            Proyek akademik Project Based Learning dengan peran yang berbeda —
            dari frontend, pengujian, sampai dokumentasi sistem.
          </p>
        </div>

        <ul className="other-list">
          {others.map((project) => (
            <li className="other-row" key={project.id}>
              <span className="other-period">{project.period}</span>
              <div className="other-row-main">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="other-row-meta">
                <span className="other-role">{project.role}</span>
                <span className="other-category">{project.category}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OtherProjects;

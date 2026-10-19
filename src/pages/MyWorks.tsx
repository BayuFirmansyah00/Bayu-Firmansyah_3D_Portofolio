import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../config";
import "./MyWorks.css";

const MyWorks = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // This route renders outside the LoadingProvider (which normally frees the
  // body scroll after the intro). Without this the page could not scroll when
  // opened directly, so re-enable scrolling while it is mounted.
  useEffect(() => {
    const previous = document.body.style.overflowY;
    document.body.style.overflowY = "auto";
    return () => {
      document.body.style.overflowY = previous;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  return (
    <main className="myworks-page">
      <header className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Kembali ke beranda
        </Link>
        <span className="eyebrow">All works</span>
        <h1 className="section-title">
          Seluruh <em>proyek</em>
        </h1>
        <p>
          Delapan proyek dari magang, inisiatif personal, PKM, dan Project Based
          Learning — masing-masing dengan peran dan periode kerjanya.
        </p>
      </header>

      <div className="myworks-grid">
        {config.projects.map((project, index) => (
          <article className="myworks-card" key={project.id}>
            <div
              className="myworks-card-image"
              onClick={() => setSelectedImage(project.image)}
              role="button"
              tabIndex={0}
              aria-label={`Perbesar gambar ${project.title}`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedImage(project.image);
                }
              }}
            >
              <img src={project.image} alt={project.title} loading="lazy" />
              <div className="image-overlay">
                <span>Perbesar</span>
              </div>
            </div>

            <div className="myworks-card-info">
              <div className="myworks-card-top">
                <span className="myworks-card-number">0{index + 1}</span>
                <span className="myworks-card-category">
                  {project.category}
                </span>
              </div>
              <h3>{project.title}</h3>
              <p className="myworks-card-description">
                {project.description}
              </p>
              <ul className="myworks-card-meta">
                {project.role && <li>{project.role}</li>}
                {project.period && <li>{project.period}</li>}
                {project.technologies && <li>{project.technologies}</li>}
              </ul>
              {(project.roleGalleries || project.screenshots) && (
                <Link
                  to={`/myworks/${project.id}`}
                  className="myworks-card-link"
                  data-cursor="disable"
                >
                  {project.roleGalleries
                    ? "Buka studi kasus →"
                    : "Lihat detail →"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox / Image Magnifier Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedImage(null)}
              aria-label="Tutup pratinjau"
            >
              ×
            </button>
            <img src={selectedImage} alt="Pratinjau proyek" />
          </div>
        </div>
      )}
    </main>
  );
};

export default MyWorks;

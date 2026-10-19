import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { config } from "../config";
import Gallery from "../components/Gallery";
import "./ProjectDetail.css";

/**
 * Halaman detail proyek. Untuk proyek dengan beberapa peran pengguna
 * (M-Speed) ditampilkan tab role; galeri memilih screenshot sesuai role aktif.
 */
const ProjectDetail = () => {
  const { projectId } = useParams();
  const [activeRole, setActiveRole] = useState(0);

  const project = useMemo(
    () => config.projects.find((item) => String(item.id) === projectId),
    [projectId]
  );

  // Route ini berada di luar LoadingProvider yang biasanya membebaskan scroll
  // body setelah intro, jadi scroll diaktifkan ulang seperti di /myworks.
  useEffect(() => {
    const previous = document.body.style.overflowY;
    document.body.style.overflowY = "auto";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflowY = previous;
    };
  }, [projectId]);

  const galleries = project?.roleGalleries ?? [];
  const activeGallery = galleries[activeRole];
  const shots = activeGallery ? activeGallery.shots : project?.screenshots ?? [];
  const hasComposite = galleries.some((gallery) => gallery.shots.length === 1);

  if (!project) {
    return (
      <div className="project-page">
        <div className="project-container">
          <Link to="/myworks" className="project-back" data-cursor="disable">
            ← Kembali ke daftar proyek
          </Link>
          <h1 className="section-title">
            Proyek <em>tidak ditemukan</em>
          </h1>
          <p className="project-empty">
            Alamat yang dibuka tidak cocok dengan proyek mana pun. Buka daftar
            lengkap di halaman all works.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="project-page">
      <div className="project-container">
        <Link to="/myworks" className="project-back" data-cursor="disable">
          ← Kembali ke daftar proyek
        </Link>

        <header className="project-head">
          <span className="eyebrow">{project.category}</span>
          <h1 className="section-title">{project.title}</h1>
          <p className="project-lede">{project.description}</p>
          <ul className="project-meta">
            {project.role && <li>{project.role}</li>}
            {project.period && <li>{project.period}</li>}
            {project.technologies && <li>{project.technologies}</li>}
          </ul>
        </header>

        {galleries.length > 0 && (
          <section className="project-section">
            <div className="project-section-head">
              <span className="eyebrow">Galeri per role</span>
              <h2>
                Setiap peran, <em>satu alur</em>
              </h2>
            </div>

            {hasComposite && (
              <p className="project-note">
                Aset asli proyek ini berupa satu berkas berisi beberapa layar
                sekaligus — daftar layarnya tertulis pada keterangan gambar.
              </p>
            )}

            <div className="role-tabs" role="tablist" aria-label="Pilih role">
              {galleries.map((gallery, index) => (
                <button
                  key={gallery.role}
                  type="button"
                  role="tab"
                  id={`role-tab-${index}`}
                  aria-selected={index === activeRole}
                  aria-controls="role-panel"
                  tabIndex={index === activeRole ? 0 : -1}
                  className={`role-tab${index === activeRole ? " is-active" : ""}`}
                  data-cursor="disable"
                  onClick={() => setActiveRole(index)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                      return;
                    }
                    event.preventDefault();
                    const next =
                      (index +
                        (event.key === "ArrowRight" ? 1 : galleries.length - 1)) %
                      galleries.length;
                    setActiveRole(next);
                    document.getElementById(`role-tab-${next}`)?.focus();
                  }}
                >
                  <span className="role-tab-name">{gallery.role}</span>
                  <span className="role-tab-count">
                    {gallery.shots.length} aset
                  </span>
                </button>
              ))}
            </div>

            <div
              className="role-panel"
              id="role-panel"
              role="tabpanel"
              aria-labelledby={`role-tab-${activeRole}`}
            >
              {activeGallery && (
                <p className="role-summary">{activeGallery.summary}</p>
              )}
              <Gallery
                shots={shots}
                label={activeGallery ? `screenshot role ${activeGallery.role}` : "screenshot"}
              />
            </div>
          </section>
        )}

        {galleries.length === 0 && shots.length > 0 && (
          <section className="project-section">
            <div className="project-section-head">
              <span className="eyebrow">Screenshots</span>
              <h2>
                Tangkapan <em>layar</em>
              </h2>
            </div>
            <Gallery shots={shots} />
          </section>
        )}

        {shots.length === 0 && (
          <p className="project-empty">
            Tangkapan layar proyek ini belum tersedia, jadi halaman ini baru
            memuat informasi proyeknya saja.
          </p>
        )}

        <footer className="project-footer">
          <Link to="/myworks" className="project-cta" data-cursor="disable">
            Lihat proyek lain →
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default ProjectDetail;

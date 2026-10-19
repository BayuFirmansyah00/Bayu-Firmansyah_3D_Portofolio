import "./styles/TechStackNew.css";
import { config, TechItem } from "../config";

// Semua item teknologi diambil dari config.skills (single source of truth).
const allTech: TechItem[] = config.skills.cards.flatMap((card) =>
  card.groups.flatMap((group) => group.items)
);

// Piramida ikon: hanya teknologi yang memiliki logo resmi terverifikasi.
// Seluruh skills (termasuk yang tanpa logo) tampil di bagian "What I Do".
const techRows: TechItem[][] = [
  allTech.filter((t) => ["Flutter", "Dart", "Android Studio", "Laravel"].includes(t.name)),
  allTech.filter((t) => ["Firebase Realtime Database", "Python", "Git"].includes(t.name)),
  allTech.filter((t) => ["GitHub", "Figma"].includes(t.name)),
  allTech.filter((t) => ["Draw.io"].includes(t.name)),
];

const TechStackNew = () => {
  return (
    <div className="techstack-new">
      <div className="techstack-content">
        <span className="eyebrow">Toolbox</span>
        <h2 className="section-title">
          Tech <em>stack</em>
        </h2>
        <p className="techstack-lede">
          Alat yang paling sering saya buka. Daftar lengkapnya ada di bagian
          What I Do.
        </p>

        <div className="techstack-pyramid">
          {techRows.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={tech.icon} alt={tech.name} loading="lazy" />
                  <span>{tech.short ?? tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;

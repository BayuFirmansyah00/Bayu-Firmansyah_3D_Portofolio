import { useCallback, useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward, MdClose } from "react-icons/md";
import type { ProjectShot } from "../config";
import "./styles/Gallery.css";

interface Props {
  shots: ProjectShot[];
  /** Dipakai untuk aria-label lightbox, mis. "screenshot role Buyer". */
  label?: string;
}

/**
 * Galeri screenshot: grid gambar asli dengan rasio terjaga (object-fit:
 * contain) dan lightbox yang bisa dikendalikan tombol maupun keyboard
 * (Escape menutup, panah kiri/kanan berpindah gambar).
 */
const Gallery = ({ shots, label = "screenshot" }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    // Fokus kembali ke tombol yang membuka lightbox.
    lastTrigger.current?.focus();
    lastTrigger.current = null;
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null
          ? current
          : (current + delta + shots.length) % shots.length
      );
    },
    [shots.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    // Pindahkan fokus ke lightbox supaya tombol/keyboard langsung siap.
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : shots[openIndex];

  return (
    <>
      <ul className="gallery-grid">
        {shots.map((shot, index) => (
          <li className="gallery-item" key={`${shot.src}-${index}`}>
            <button
              type="button"
              className="gallery-thumb"
              data-cursor="disable"
              aria-label={`Perbesar: ${shot.caption ?? shot.alt}`}
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                setOpenIndex(index);
              }}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </button>
            {shot.caption && (
              <p className="gallery-caption">{shot.caption}</p>
            )}
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau ${label}`}
          onClick={close}
        >
          <div
            className="gallery-modal-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="gallery-close"
              onClick={close}
              aria-label="Tutup pratinjau"
            >
              <MdClose />
            </button>

            <img className="gallery-modal-image" src={active.src} alt={active.alt} />

            <div className="gallery-modal-bar">
              {shots.length > 1 && (
                <button
                  type="button"
                  className="gallery-nav"
                  onClick={() => step(-1)}
                  aria-label="Screenshot sebelumnya"
                >
                  <MdArrowBack />
                </button>
              )}
              <p className="gallery-modal-meta">
                <span>
                  {(openIndex ?? 0) + 1}/{shots.length}
                </span>
                {active.caption && ` — ${active.caption}`}
              </p>
              {shots.length > 1 && (
                <button
                  type="button"
                  className="gallery-nav"
                  onClick={() => step(1)}
                  aria-label="Screenshot berikutnya"
                >
                  <MdArrowForward />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current!;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    // AbortController so every listener registered below can be released
    // in one shot when this component unmounts (e.g. route change).
    const abort = new AbortController();
    const signal = abort.signal;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      // Lingkaran tetap tersembunyi sampai gerakan mouse pertama, supaya
      // tidak menumpuk di pojok layar sebelum kursor dikendalikan.
      cursor.classList.add("cursor-active");
    };
    document.addEventListener("mousemove", onMouseMove, { signal });

    let loopId: number | undefined;
    loopId = requestAnimationFrame(function loop() {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
      }
      loopId = requestAnimationFrame(loop);
    });

    document.querySelectorAll("[data-cursor]").forEach((item) => {
      const element = item as HTMLElement;
      element.addEventListener(
        "mouseover",
        (e: MouseEvent) => {
          const target = e.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();

          if (element.dataset.cursor === "icons") {
            cursor.classList.add("cursor-icons");

            gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
            cursor.style.setProperty("--cursorH", `${rect.height}px`);
            hover = true;
          }
          if (element.dataset.cursor === "disable") {
            cursor.classList.add("cursor-disable");
          }
        },
        { signal }
      );
      element.addEventListener(
        "mouseout",
        () => {
          cursor.classList.remove("cursor-disable", "cursor-icons");
          hover = false;
        },
        { signal }
      );
    });

    return () => {
      if (loopId !== undefined) cancelAnimationFrame(loopId);
      abort.abort();
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;

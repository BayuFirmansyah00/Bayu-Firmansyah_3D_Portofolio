import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { LoadingContext, type LoadingType } from "./useLoading";

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading on mobile
    if (window.innerWidth <= 768) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };
  useEffect(() => {
    // Auto-start animations on mobile since there's no 3D model
    let timer: number | undefined;
    if (window.innerWidth <= 768) {
      import("../components/utils/initialFX").then((module) => {
        if (module.initialFX) {
          timer = window.setTimeout(() => {
            module.initialFX();
          }, 100);
        }
      });
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {}, [loading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

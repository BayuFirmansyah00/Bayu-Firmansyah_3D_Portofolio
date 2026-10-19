import { createContext, useContext } from "react";

// Konteks & hook dipindahkan keluar dari LoadingProvider.tsx agar file
// tersebut hanya mengekspor komponen (syarat fast-refresh). Perilaku
// context, guard, dan error-nya tidak berubah sama sekali.
export interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

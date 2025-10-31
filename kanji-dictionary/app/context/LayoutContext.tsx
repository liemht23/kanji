"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type LayoutContextType = {
  isDocked: boolean;
  setIsDocked: (val: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isDocked, setIsDocked] = useState(false);
  return (
    <LayoutContext.Provider value={{ isDocked, setIsDocked }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
};

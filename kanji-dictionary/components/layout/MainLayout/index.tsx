"use client";
import { ReactNode } from "react";
import Navigation from "./Navigation";
import { useLayout } from "@/app/context/LayoutContext";
import { cn } from "@/utils/class-name";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isDocked, setIsDocked, isMobile } = useLayout();

  return (
    <div className="bg-black-50 h-screen relative overflow-hidden">
      <div
        className={cn(
          "transition-all duration-300 h-full",
          isDocked ? "grid grid-cols-12" : "flex flex-col"
        )}
      >
        <div
          className={cn(
            "transition-all duration-300",
            isDocked
              ? "col-span-2 relative"
              : "absolute top-8 left-10 right-0 z-50"
          )}
        >
          <Navigation
            isDocked={isDocked}
            isMobile={isMobile}
            setIsDocked={setIsDocked}
          />
        </div>

        <div
          className={cn(
            "transition-all duration-300",
            isDocked ? "col-span-10" : "w-full"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

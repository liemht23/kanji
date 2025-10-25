"use client";

import { ReactNode } from "react";
import Header from "./Header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-10 py-8 bg-black-50 h-screen">
      <Header />
      <div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

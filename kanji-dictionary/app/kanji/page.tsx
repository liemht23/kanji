"use client";
import { useLayout } from "@/app/context/LayoutContext";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";

const KanjiPage = () => {
  const { isMobile } = useLayout();

  return (
    <div className={isMobile ? "p-4" : "px-10 py-8 "}>
      <KanjiToolBar />
      <KanjiCard />
    </div>
  );
};

export default KanjiPage;

"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useLayout } from "@/app/context/LayoutContext";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";
import Spinner from "@/components/common/Spinner";

const KanjiPage = () => {
  const { isMobile } = useLayout();
  const { checking } = useAuthGuard();

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className={isMobile ? "p-4" : "px-10 py-8"}>
      <KanjiToolBar />
      <KanjiCard />
    </div>
  );
};

export default KanjiPage;

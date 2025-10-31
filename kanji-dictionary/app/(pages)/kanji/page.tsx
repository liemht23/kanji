"use client";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";

const KanjiPage = () => {
  return (
    <div className="px-10 py-8 ">
      <KanjiToolBar />
      <KanjiCard />
    </div>
  );
};

export default KanjiPage;

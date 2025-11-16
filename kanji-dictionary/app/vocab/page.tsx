"use client";
import React, { useState } from "react";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useLayout } from "@/app/context/LayoutContext";
import Spinner from "@/components/common/Spinner";
import VocabToolBar from "./components/VocabToolbar";
import VocabCard from "./components/VocabCard";

const VocabPage = () => {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const { isMobile } = useLayout();
  const { checking } = useAuthGuard();

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  // Danh sách bài học mẫu
  const lessons = [
    { id: 1, title: "Bài 1", tag: "N5", jp: "第一課" },
    { id: 2, title: "Bài 2", tag: "N5", jp: "第二課" },
    { id: 3, title: "Bài 3", tag: "N5", jp: "第三課" },
    { id: 4, title: "Bài 4", tag: "N5", jp: "第四課" },
  ];

  // Luôn gọi hook ở đầu component, không đặt trong điều kiện
  return (
    <div className={isMobile ? "p-4" : "px-10 py-8"}>
      <VocabToolBar
        isVocabFlashCard={!!selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
      {!selectedLesson ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`flex flex-col items-center justify-center p-8 bg-white border border-black-100 rounded-2xl shadow 
                hover:shadow-lg hover:bg-blue-50 transition cursor-pointer min-h-[140px] group`}
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <div className="text-lg font-bold text-blue-700 mb-1">
                {lesson.title}
              </div>
              <div className="text-xs text-blue-500 mb-1">[{lesson.tag}]</div>
              <div className="text-base text-gray-700">{lesson.jp}</div>
              <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-400 mt-2 transition">
                Nhấn để xem từ vựng
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <VocabCard />
        </div>
      )}
    </div>
  );
};

export default VocabPage;

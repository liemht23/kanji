"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSelectedKanji } from "@/store/slices/kanji-collection";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const KanjiListPane = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fadeBg, setFadeBg] = useState(false);
  const { kanjiCards, selectedKanji } = useAppSelector(
    (state: RootState) => state.kanji
  );
  const fadeRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  // Handle fade background open/close transitions
  useEffect(() => {
    const fadeLayer = fadeRef.current;
    if (!fadeLayer) return;

    if (isOpen) {
      requestAnimationFrame(() => setFadeBg(true));
    } else {
      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName === "opacity") {
          setFadeBg(false);
          fadeLayer.removeEventListener("transitionend", handleTransitionEnd);
        }
      };
      fadeLayer.addEventListener("transitionend", handleTransitionEnd);

      const fallback = setTimeout(() => setFadeBg(false), 400);
      return () => {
        clearTimeout(fallback);
        fadeLayer.removeEventListener("transitionend", handleTransitionEnd);
      };
    }
  }, [isOpen]);

  // Group kanji for performance
  const groupedKanji = [];
  for (let i = 0; i < kanjiCards.length; i += 100) {
    groupedKanji.push(kanjiCards.slice(i, i + 100));
  }

  const handleSelectKanji = (kanji: (typeof kanjiCards)[number]) => {
    dispatch(setSelectedKanji(kanji));
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[1000]">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-[1001]
             w-10 h-16 bg-transparent 
             border border-gray-300 border-r-0 
             rounded-l-[9999px] shadow-sm 
             flex items-center justify-center
             transition-all duration-300 
             hover:bg-gray-100 hover:shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-black transition-colors" />
        </button>
      )}

      {/* Fade Background */}
      <div
        ref={fadeRef}
        className={cn(
          "fixed inset-0 z-[1000] transition-opacity duration-300 ease-out",
          fadeBg
            ? "bg-black/25 backdrop-blur-[2px] transition-opacity duration-300"
            : "bg-black/0 opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={cn(
          `fixed right-0 top-0 h-full w-[40vw] bg-white z-[1001]
      shadow-xl overflow-y-auto px-8 transform transition-all duration-500 ease-out
      flex flex-col items-center`,
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        )}
      >
        <div
          className={cn(
            "transform transition-all duration-500 ease-out",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Fixed Header */}
          <div className="sticky top-0 bg-white z-10 pt-8 pb-4  border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-center">KANJI LIST</h2>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto mt-4 flex flex-col items-center">
            {groupedKanji.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-16 flex flex-col items-center">
                {Array.from({ length: Math.ceil(group.length / 10) }).map(
                  (_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-2 mb-1">
                      {group
                        .slice(rowIdx * 10, rowIdx * 10 + 10)
                        .map((kanji, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleSelectKanji(kanji)}
                            className={cn(
                              `text-2xl cursor-pointer px-2 py-1 rounded-md select-none
                     transition-all duration-200 ease-out transform`,
                              kanji.id === selectedKanji?.id
                                ? "bg-blue-300 text-white scale-110 shadow-sm"
                                : "hover:scale-125 hover:bg-gray-100 hover:shadow-sm active:scale-95"
                            )}
                          >
                            {kanji.character}
                          </span>
                        ))}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiListPane;

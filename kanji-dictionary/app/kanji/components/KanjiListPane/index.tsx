"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setListAllQuiz,
  setListCurrentQuiz,
  setOpenQuiz,
  setSelectedKanji,
  setSelectedKanjiRange,
} from "@/store/slices/kanji-collection";
import { RootState } from "@/store/store";
import { Kanji } from "@/types/kanji";
import { cn } from "@/utils/class-name";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const KanjiListPane = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fadeBg, setFadeBg] = useState(false);
  const { kanjiCards, selectedKanji, selectedKanjiRange } = useAppSelector(
    (state: RootState) => state.kanji
  );

  // For region selection
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [rect, setRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const kanjiPaneRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
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

  // Click only one kanji
  const handleSelectKanji = (kanji: (typeof kanjiCards)[number]) => {
    dispatch(setSelectedKanji(kanji));
    setIsOpen(false);
  };

  // Handlers for region selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (!scrollContentRef.current) return;
    const rect = scrollContentRef.current.getBoundingClientRect();
    const scrollTop = scrollContentRef.current.scrollTop;
    const scrollLeft = scrollContentRef.current.scrollLeft;
    setIsSelecting(true);
    setStartPoint({
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
    });
    setEndPoint({
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !scrollContentRef.current) return;
    const rect = scrollContentRef.current.getBoundingClientRect();
    const scrollTop = scrollContentRef.current.scrollTop;
    const scrollLeft = scrollContentRef.current.scrollLeft;
    setEndPoint({
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartPoint(null);
    setEndPoint(null);
    setRect(null);
  };

  const handleDoQuiz = () => {
    // If selectedKanji is an array with more than 2 items, do something
    if (Array.isArray(selectedKanjiRange) && selectedKanjiRange.length > 2) {
      const timePerQuestion = 30; // As default
      const numQuestions = selectedKanjiRange.length;
      // Prepare quiz data
      const allQuiz = selectedKanjiRange.flatMap((card) => card.example);
      // Shuffle (Fisher–Yates)
      for (let i = allQuiz.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuiz[i], allQuiz[j]] = [allQuiz[j], allQuiz[i]];
      }
      // Add index
      const quizData = allQuiz.map((quiz, index) => ({
        ...quiz,
        quizIndex: index,
      }));

      dispatch(setListAllQuiz(quizData));
      dispatch(setListCurrentQuiz(quizData));
      dispatch(
        setOpenQuiz({
          isOpenQuiz: true,
          timePerQuestion,
          numQuestions,
        })
      );
      dispatch(setSelectedKanjiRange(null));
      setIsOpen(false);
    }
  };

  // Calculate rectangle overlay during selection
  useEffect(() => {
    if (!isSelecting || !startPoint || !endPoint) {
      setRect(null);
      return;
    }
    const left = Math.min(startPoint.x, endPoint.x);
    const top = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(startPoint.x - endPoint.x);
    const height = Math.abs(startPoint.y - endPoint.y);
    setRect({ left, top, width, height });
  }, [isSelecting, startPoint, endPoint]);

  // When the region selection ends, determine the kanji within the region
  useEffect(() => {
    if (!rect || !scrollContentRef.current || !isSelecting) return;
    // Get all kanji span elements
    const kanjiSpans =
      scrollContentRef.current.querySelectorAll<HTMLSpanElement>(
        "span[data-kanji-id]"
      );
    const selected: Kanji[] = [];
    kanjiSpans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const parentRect = scrollContentRef.current!.getBoundingClientRect();
      // Location relative to scroll content (accounting for scroll)
      const sx =
        spanRect.left - parentRect.left + scrollContentRef.current!.scrollLeft;
      const sy =
        spanRect.top - parentRect.top + scrollContentRef.current!.scrollTop;
      const ex = sx + spanRect.width;
      const ey = sy + spanRect.height;
      // Check overlap
      if (
        ex > rect.left &&
        sx < rect.left + rect.width &&
        ey > rect.top &&
        sy < rect.top + rect.height
      ) {
        const id = span.getAttribute("data-kanji-id");
        const found = kanjiCards.find((k) => String(k.id) === id);
        if (found) selected.push(found);
      }
    });
    // If there is a selected region, set selectedKanji to the array, otherwise clear it
    if (selected.length > 0) {
      dispatch(setSelectedKanjiRange(selected));
    } else {
      dispatch(setSelectedKanjiRange(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect]);

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
        ref={kanjiPaneRef}
        style={{ userSelect: isSelecting ? "none" : undefined }}
      >
        <div
          className={cn(
            "transform transition-all duration-500 ease-out",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Fixed Header */}
          <div className="sticky top-0 bg-white z-10 pt-8 pb-4  border-b border-gray-200 flex items-center justify-between">
            <div className="w-[110px] flex-shrink-0" aria-hidden="true"></div>
            <h2 className="text-2xl font-semibold text-center flex-1">
              KANJI LIST
            </h2>
            <button
              className={cn(
                "ml-4 px-4 py-2 bg-[#8f5cf7] text-white rounded-md shadow hover:bg-[#7a3ee6] transition-colors",
                !(
                  Array.isArray(selectedKanjiRange) &&
                  selectedKanjiRange.length > 2
                ) && "invisible"
              )}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleDoQuiz}
            >
              Do Quiz!
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto mt-4 flex flex-col items-center relative"
            ref={scrollContentRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Rectangle overlay */}
            {rect && (
              <div
                className="absolute z-[20] pointer-events-none border-2 border-blue-500 bg-blue-500/15"
                style={{
                  left: rect.left,
                  top: rect.top,
                  width: rect.width,
                  height: rect.height,
                }}
              />
            )}
            {groupedKanji.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-10 flex flex-col items-center">
                {Array.from({ length: Math.ceil(group.length / 10) }).map(
                  (_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-2 m-2">
                      {group
                        .slice(rowIdx * 10, rowIdx * 10 + 10)
                        .map((kanji, idx) => {
                          // Priority: selectedKanji > selectedKanjiRange
                          let isIndividuallySelected = false;
                          let isRangeSelected = false;

                          // 1. Check individual selectedKanji
                          if (Array.isArray(selectedKanji)) {
                            isIndividuallySelected = selectedKanji.some(
                              (k) => k.id === kanji.id
                            );
                          } else if (
                            selectedKanji &&
                            selectedKanji.id === kanji.id
                          ) {
                            isIndividuallySelected = true;
                          }

                          // 2. Check range selection (only used if NOT individually selected)
                          if (
                            !isIndividuallySelected &&
                            Array.isArray(selectedKanjiRange)
                          ) {
                            isRangeSelected = selectedKanjiRange.some(
                              (k) => k.id === kanji.id
                            );
                          }
                          return (
                            <span
                              key={idx}
                              data-kanji-id={kanji.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectKanji(kanji);
                              }}
                              className={cn(
                                `text-2xl cursor-pointer px-2 py-1 rounded-md select-none
                                transition-all duration-200 ease-out transform`,

                                // Priority 1: selectedKanji → red highlight
                                isIndividuallySelected &&
                                  "bg-red-400 text-white scale-110 shadow",

                                // Priority 2: range-selected → blue highlight
                                !isIndividuallySelected &&
                                  isRangeSelected &&
                                  "bg-blue-300 text-white scale-105 shadow-sm",

                                // Default style
                                !isIndividuallySelected &&
                                  !isRangeSelected &&
                                  "hover:scale-125 hover:bg-gray-100 hover:shadow-sm active:scale-95"
                              )}
                            >
                              {kanji.character}
                            </span>
                          );
                        })}
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

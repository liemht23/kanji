import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSelectedKanji } from "@/store/slices/kanji-collection";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import { useEffect, useRef, useState } from "react";

const KanjiListModal = () => {
  const { kanjiCards, selectedKanji, loading } = useAppSelector(
    (state: RootState) => state.kanji
  );
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSelectKanji = (kanji: (typeof kanjiCards)[number]) => {
    dispatch(setSelectedKanji(kanji));
  };

  // Fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || !selectedKanji) return;

    const listItems = scrollRef.current.querySelectorAll("li");
    const selectedIndex = kanjiCards.findIndex(
      (k) => k.id === selectedKanji.id
    );

    if (selectedIndex === -1) return;

    const selectedItem = listItems[selectedIndex] as HTMLElement;
    if (selectedItem) {
      const scrollLeft =
        selectedItem.offsetLeft -
        scrollRef.current.clientWidth / 2 +
        selectedItem.clientWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedKanji, kanjiCards]);

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        `absolute top-26 left-1/2 -translate-x-1/2 max-w-[60vw] overflow-x-auto no-scrollbar z-100 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing
        transform transition-all duration-300 ease-out`,
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="flex flex-row gap-2 w-fit select-none">
          {kanjiCards.map((kanji) => (
            <li
              key={kanji.id}
              onClick={() => handleSelectKanji(kanji)}
              className={`text-2xl px-2 py-1 rounded-md transition-transform duration-200 ease-out ${
                kanji.id === selectedKanji?.id ? "bg-blue-300 text-white" : ""
              } hover:scale-200`}
            >
              {kanji.character}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KanjiListModal;

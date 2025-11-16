import Tooltip from "@/components/common/Tooltip";
import { cn } from "@/utils/class-name";
import {
  ArrowDownAZ,
  CircleChevronLeft,
  CircleChevronRight,
  CircleX,
  Search,
  Undo2,
} from "lucide-react";
import { useRef, useState } from "react";

interface VocabToolBarProps {
  isVocabFlashCard: boolean;
  onBack: () => void;
}

const VocabToolBar = ({ isVocabFlashCard, onBack }: VocabToolBarProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="flex items-center mb-4 justify-end">
        <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
          <div className="flex items-center relative">
            <div
              className={cn(
                `flex items-center border border-black-400 text-black-900 rounded-lg focus:ring-blue-300 focus:border-blue-500
                  transition-all duration-300 ease-in-out overflow-hidden`,
                isSearchVisible
                  ? "w-fit opacity-100 p-2"
                  : "w-0 opacity-0 p-0 border-0"
              )}
            >
              <Search className="absolute left-3 text-black-400 w-5 h-5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                id="searchCharacter"
                name="searchCharacter"
                // value={searchCharacter}
                // onChange={(e) => setSearchCharacter(e.target.value)}
                // onCompositionStart={() => setIsComposing(true)}
                // onCompositionEnd={() => setIsComposing(false)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter" && !isComposing) handleSearch();
                // }}
                placeholder="Enter ONE kanji only..."
                className="flex-1 text-md text-black-900 bg-transparent outline-none pl-7 pr-2"
              />

              <CircleX
                className="w-5 h-5 text-black-400 hover:text-red-500 cursor-pointer transition ml-1"
                // onClick={() => {
                //   setIsSearchVisible(false);
                //   setSearchCharacter("");
                // }}
              />
            </div>

            {!isSearchVisible && (
              <Tooltip text="Search Kanji">
                <Search
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900 transition"
                  onClick={() => {
                    setIsSearchVisible(true);
                    queueMicrotask(() => searchInputRef.current?.focus());
                  }}
                />
              </Tooltip>
            )}
          </div>

          {!isVocabFlashCard && (
            <div className="flex items-center gap-4 border-l border-black-100 pl-4">
              <Tooltip text="Tăng dần">
                <ArrowDownAZ
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900 transition"
                  onClick={onBack}
                />
              </Tooltip>
            </div>
          )}
          {isVocabFlashCard && (
            <>
              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Previous">
                  <CircleChevronLeft
                    className={cn(
                      "w-8 h-8 cursor-pointer",
                      true
                        ? "text-black-400 hover:text-black-900"
                        : "text-gray-300 cursor-not-allowed"
                    )}
                    // onClick={
                    //   hasPrevious
                    //     ? () => handleGetKanji(PREVIOUS_STEP_SIZE)
                    //     : undefined
                    // }
                  />
                </Tooltip>

                <Tooltip text="Next">
                  <CircleChevronRight
                    className={cn(
                      "w-8 h-8 cursor-pointer",
                      true
                        ? "text-black-400 hover:text-black-900"
                        : "text-gray-300 cursor-not-allowed"
                    )}
                    // onClick={
                    //   hasNext ? () => handleGetKanji(NEXT_STEP_SIZE) : undefined
                    // }
                  />
                </Tooltip>
              </div>
              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Back to list">
                  <Undo2
                    className="w-8 h-8 cursor-pointer text-black-400 hover:text-black-900"
                    onClick={onBack}
                  />
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default VocabToolBar;

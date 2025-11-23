import Tooltip from "@/components/common/Tooltip";
import { NEXT_STEP_SIZE, PREVIOUS_STEP_SIZE } from "@/constants/common-const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setSelectedCollection,
  setSelectedVocab,
} from "@/store/slices/vocab-collection";
import { RootState } from "@/store/store";
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
import {
  SEARCH_VOCAB,
  SEARCH_VOCAB_COLLECTION,
} from "../../../../constants/vocab-const";

interface VocabToolBarProps {
  selectedVocabCollection: boolean;
  onBack: () => void;
}

const VocabToolBar = ({
  selectedVocabCollection,
  onBack,
}: VocabToolBarProps) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const dispatch = useAppDispatch();
  const { listVocabCollections, vocabCards, selectedVocab } = useAppSelector(
    (state: RootState) => state.vocabCollection
  );

  const selectedIndex = vocabCards.findIndex(
    (item) => item.id === selectedVocab?.id
  );
  const hasPrevious = selectedIndex > 0;
  const hasNext = selectedIndex < vocabCards.length - 1;
  const searchInputName = selectedVocabCollection
    ? SEARCH_VOCAB
    : SEARCH_VOCAB_COLLECTION;

  const handleGetVocab = (step: number) => {
    const newIndex = selectedIndex + step;
    if (newIndex >= 0 && newIndex < vocabCards.length) {
      const newVocab = vocabCards[newIndex];
      dispatch(setSelectedVocab(newVocab));
    }
  };

  const handleSearch = () => {
    if (inputSearch.trim().length === 0) return;

    if (searchInputName === SEARCH_VOCAB_COLLECTION) {
      handleSearchVocabCollection();
    } else {
      handleSearchVocab();
    }
  };

  const handleSearchVocabCollection = () => {
    const searchValue = inputSearch.trim().toLowerCase();
    const foundCollection = listVocabCollections.find(
      (item) =>
        item.title.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue)
    );

    if (foundCollection) {
      dispatch(setSelectedCollection(foundCollection));
    } else {
      alert("Vocab Collection not found!");
    }
  };

  const handleSearchVocab = () => {
    const searchValue = inputSearch.trim().toLowerCase();
    const foundVocab = vocabCards.find((item) =>
      item.word.vocab.toLowerCase().includes(searchValue)
    );

    if (foundVocab) {
      dispatch(setSelectedVocab(foundVocab));
    } else {
      alert("Vocab not found!");
    }
  };

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
                id={searchInputName}
                name={searchInputName}
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isComposing) handleSearch();
                }}
                placeholder="Enter ONE kanji only..."
                className="flex-1 text-md text-black-900 bg-transparent outline-none pl-7 pr-2"
              />

              <CircleX
                className="w-5 h-5 text-black-400 hover:text-red-500 cursor-pointer transition ml-1"
                onClick={() => {
                  setIsSearchVisible(false);
                  setInputSearch("");
                }}
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

          {!selectedVocabCollection && (
            <div className="flex items-center gap-4 border-l border-black-100 pl-4">
              <Tooltip text="Tăng dần">
                <ArrowDownAZ
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900 transition"
                  onClick={onBack}
                />
              </Tooltip>
            </div>
          )}
          {selectedVocabCollection && (
            <>
              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Previous">
                  <CircleChevronLeft
                    className={cn(
                      "w-8 h-8 cursor-pointer",
                      hasPrevious
                        ? "text-black-400 hover:text-black-900"
                        : "text-gray-300 cursor-not-allowed"
                    )}
                    onClick={
                      hasPrevious
                        ? () => handleGetVocab(PREVIOUS_STEP_SIZE)
                        : undefined
                    }
                  />
                </Tooltip>

                <Tooltip text="Next">
                  <CircleChevronRight
                    className={cn(
                      "w-8 h-8 cursor-pointer",
                      hasNext
                        ? "text-black-400 hover:text-black-900"
                        : "text-gray-300 cursor-not-allowed"
                    )}
                    onClick={
                      hasNext ? () => handleGetVocab(NEXT_STEP_SIZE) : undefined
                    }
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

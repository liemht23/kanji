import Tooltip from "@/components/common/Tooltip";
import { NEXT_STEP_SIZE, PREVIOUS_STEP_SIZE } from "@/constants/common-const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getKanjiThunk,
  searchKanjiThunk,
  updateIsOfficialThunk,
} from "@/store/slices/kanji-card/thunk";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import {
  CircleCheck,
  CircleChevronLeft,
  CircleChevronRight,
  CirclePlus,
  CircleX,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from "@/types/user-role";
import AddKanjiModal from "../AddKanjiModal";
import { useLayout } from "@/app/context/LayoutContext";
import { clearEditedKanji, setEditedKanji } from "@/store/slices/kanji-card";
import useAuthGuard from "@/hooks/useAuthGuard";
import { INITIAL_KANJI_ID } from "@/constants/kanji-const";

const KanjiToolBar = () => {
  const dispatch = useAppDispatch();
  const [isOpenAddKanjiModal, setIsOpenAddKanjiModal] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const { role } = useAuthGuard();
  const { kanjiWord, maxKanjiId, minKanjiId, loading } = useAppSelector(
    (state: RootState) => state.kanjiCard
  );
  const { isModalOpen } = useLayout();
  const handleGetKanji = useCallback(
    (step: number) => {
      if (!kanjiWord?.kanji_id) return;
      const newId = kanjiWord.kanji_id + step;
      if (newId < minKanjiId || newId > maxKanjiId) return;
      dispatch(getKanjiThunk(newId));
    },
    [kanjiWord, minKanjiId, maxKanjiId, dispatch]
  );

  const handleSearch = () => {
    if (searchCharacter.trim().length === 0) return;

    dispatch(searchKanjiThunk(searchCharacter))
      .unwrap()
      .then(() => console.log("Tìm thấy Kanji"))
      .catch(() => {
        alert("Kanji not found!");
        dispatch(getKanjiThunk(INITIAL_KANJI_ID));
      });
  };

  const handleEditKanji = () => {
    dispatch(setEditedKanji(kanjiWord));
    setIsOpenAddKanjiModal(true);
  };

  const handleAddKanji = () => {
    dispatch(clearEditedKanji());
    setIsOpenAddKanjiModal(true);
  };

  const handleDeleteKanji = () => {
    alert("Chưa có làm chức năng xoá kanji!");
  };

  const handleCheckOfficial = () => {
    dispatch(
      updateIsOfficialThunk({ kanjiId: kanjiWord.kanji_id, isOfficial: true })
    ).unwrap();
  };

  const hasPrevious =
    kanjiWord?.kanji_id !== undefined && minKanjiId !== null
      ? kanjiWord.kanji_id > minKanjiId
      : false;

  const hasNext =
    kanjiWord?.kanji_id !== undefined && maxKanjiId !== null
      ? kanjiWord.kanji_id < maxKanjiId
      : false;

  useEffect(() => {
    let lastFPress = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      if (document.activeElement === searchInputRef.current) {
        if (e.key === "Escape") {
          setIsSearchVisible(false);
          setSearchCharacter("");
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === "Escape" && isSearchVisible) {
        setIsSearchVisible(false);
        setSearchCharacter("");
        searchInputRef.current?.blur();
      }

      if (e.key.toLowerCase() === "f") {
        const now = Date.now();
        if (now - lastFPress < 400) {
          setIsSearchVisible((prev) => {
            const newState = !prev;
            if (newState) {
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }
            return newState;
          });
          setSearchCharacter("");
        }
        lastFPress = now;
      }

      if (e.key === "ArrowLeft" && hasPrevious) {
        handleGetKanji(PREVIOUS_STEP_SIZE);
      }

      if (e.key === "ArrowRight" && hasNext) {
        handleGetKanji(NEXT_STEP_SIZE);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrevious, hasNext, handleGetKanji, isSearchVisible, isModalOpen]);

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
                value={searchCharacter}
                onChange={(e) => setSearchCharacter(e.target.value)}
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
                  setSearchCharacter("");
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
                    ? () => handleGetKanji(PREVIOUS_STEP_SIZE)
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
                  hasNext ? () => handleGetKanji(NEXT_STEP_SIZE) : undefined
                }
              />
            </Tooltip>
          </div>

          {role === ADMIN_ROLE && (
            <div className="flex items-center gap-4 border-l border-black-100 pl-4">
              <Tooltip text="Add">
                <CirclePlus
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                  onClick={handleAddKanji}
                />
              </Tooltip>
            </div>
          )}

          {role === SUPER_ADMIN_ROLE && (
            <>
              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Edit">
                  <SquarePen
                    className="w-8 h-8 cursor-pointer text-black-400 hover:text-black-900"
                    onClick={handleEditKanji}
                  />
                </Tooltip>
                <Tooltip text="Add">
                  <CirclePlus
                    className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                    onClick={handleAddKanji}
                  />
                </Tooltip>
                <Tooltip text="Delete">
                  <Trash2
                    className="w-8 h-8 cursor-pointer text-black-400 hover:text-black-900"
                    onClick={handleDeleteKanji}
                  />
                </Tooltip>
              </div>
              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Official Kanji">
                  <CircleCheck
                    className={cn(
                      "w-8 h-8 cursor-pointer",
                      kanjiWord?.is_official
                        ? "text-green-500 cursor-not-allowed"
                        : "text-black-400 hover:text-black-900"
                    )}
                    onClick={
                      !kanjiWord?.is_official ? handleCheckOfficial : undefined
                    }
                  />
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </div>
      <AddKanjiModal
        isOpen={isOpenAddKanjiModal}
        onClose={() => setIsOpenAddKanjiModal(false)}
      />
    </>
  );
};

export default KanjiToolBar;

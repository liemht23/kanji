import Tooltip from "@/components/common/Tooltip";
import { NEXT_STEP_SIZE, PREVIOUS_STEP_SIZE } from "@/constants/common-const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import {
  ArrowDownAZ,
  CircleChevronLeft,
  CircleChevronRight,
  CirclePlus,
  CircleX,
  ListTree,
  Save,
  Search,
  SquarePen,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from "@/types/user-role";
import AddKanjiModal from "../AddKanjiModal";
import { useLayout } from "@/app/context/LayoutContext";
import useAuthGuard from "@/hooks/useAuthGuard";
import {
  setEditedKanji,
  setSelectedKanji,
} from "@/store/slices/kanji-collection";
import {
  updateIsPublishedThunk,
  upsertBookmarkedKanjiThunk,
} from "@/store/slices/kanji-collection/thunk";
import KanjiListModal from "../KanjiListModal";

interface KanjiToolBarProps {
  onBack: () => void;
}

const KanjiToolBar = ({ onBack }: KanjiToolBarProps) => {
  const dispatch = useAppDispatch();
  const [isOpenAddKanjiModal, setIsOpenAddKanjiModal] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOpenSearchInListModal, setIsOpenSearchInListModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const { role, userId } = useAuthGuard();
  const {
    selectedCollection,
    listBookmarkedKanji,
    kanjiCards,
    selectedKanji,
    loading,
  } = useAppSelector((state: RootState) => state.kanji);
  const { isModalOpen } = useLayout();
  const iconRef = useRef<SVGSVGElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const kanjiIds = kanjiCards.map((kc) => kc.kanji_id);
  const minKanjiId = Math.min(...kanjiIds);
  const maxKanjiId = Math.max(...kanjiIds);

  const handleGetKanji = useCallback(
    (step: number) => {
      if (!selectedKanji?.kanji_id) return;
      const newId = selectedKanji.kanji_id + step;

      if (newId < minKanjiId || newId > maxKanjiId) return;
      const selectedKanjiExists = kanjiCards.find(
        (kc) => kc.kanji_id === newId
      );
      if (!selectedKanjiExists) return;
      dispatch(setSelectedKanji(selectedKanjiExists));
    },
    [selectedKanji, minKanjiId, maxKanjiId, kanjiCards, dispatch]
  );

  const handleSearch = () => {
    if (searchCharacter.trim().length === 0) return;

    const foundKanji = kanjiCards.find(
      (kc) => kc.character === searchCharacter.trim()
    );
    if (foundKanji) {
      dispatch(setSelectedKanji(foundKanji));
    } else {
      alert("Kanji not found in the current collection!");
    }
  };

  const handleEditKanji = () => {
    dispatch(setEditedKanji(selectedKanji));
    setIsOpenAddKanjiModal(true);
  };

  const handleAddKanji = () => {
    setIsOpenAddKanjiModal(true);
  };

  const handleDeleteKanji = () => {
    alert("Chưa có làm tính năng xoá kanji!");
  };

  const saveBookmark = () => {
    if (!userId || !selectedCollection) return;

    dispatch(
      upsertBookmarkedKanjiThunk({
        userId: userId!,
        collectionId: selectedCollection.id,
        kanjiIds: listBookmarkedKanji,
      })
    ).unwrap();
  };

  const handlePublished = () => {
    if (loading || !selectedKanji?.id) return;
    dispatch(
      updateIsPublishedThunk({ id: selectedKanji.id, isPublished: true })
    ).unwrap();
  };

  const hasPrevious =
    selectedKanji?.kanji_id !== undefined && minKanjiId !== null
      ? selectedKanji.kanji_id > minKanjiId
      : false;

  const hasNext =
    selectedKanji?.kanji_id !== undefined && maxKanjiId !== null
      ? selectedKanji.kanji_id < maxKanjiId
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        iconRef.current &&
        !iconRef.current.contains(target)
      ) {
        setIsOpenSearchInListModal(false);
      }
    };

    if (isOpenSearchInListModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpenSearchInListModal]);

  return (
    <>
      <div className="flex items-center mb-4 justify-end gap-10">
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
                placeholder="Enter one kanji only..."
                className="flex-1 text-md text-black-900 bg-transparent outline-none pl-7 pr-2"
              />

              <CircleX
                className="w-5 h-5 text-black-400 hover:text-black-900 cursor-pointer transition ml-1"
                onClick={() => {
                  setIsSearchVisible(false);
                  setSearchCharacter("");
                }}
              />
            </div>

            {!isSearchVisible && (
              <Tooltip text="Search">
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

          {!selectedCollection && (
            <div className="flex items-center gap-4 border-l border-black-100 pl-4">
              <Tooltip text="Tăng dần">
                <ArrowDownAZ
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900 transition"
                  onClick={onBack}
                />
              </Tooltip>
            </div>
          )}

          {selectedCollection && (
            <>
              <>
                <Tooltip text="Search In List">
                  <ListTree
                    ref={iconRef}
                    className="w-8 h-8 cursor-pointer text-black-400 hover:text-black-900"
                    onClick={() => setIsOpenSearchInListModal((prev) => !prev)}
                  />
                </Tooltip>
                {isOpenSearchInListModal && (
                  <div className="fixed inset-0 z-[99] pointer-events-none">
                    <div ref={modalRef} className="pointer-events-auto">
                      <KanjiListModal />
                    </div>
                  </div>
                )}
              </>

              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Save Bookmark">
                  <Save
                    className="w-8 h-8 cursor-pointer text-black-400 hover:text-black-900"
                    onClick={saveBookmark}
                  />
                </Tooltip>
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
                        className="w-8 h-8 cursor-pointer text-black-400 hover:text-red-500"
                        onClick={handleDeleteKanji}
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                    <Tooltip text="Published">
                      <Upload
                        className={cn(
                          "w-8 h-8 cursor-pointer",
                          selectedKanji?.is_published
                            ? "text-green-500 cursor-not-allowed"
                            : "text-black-400 hover:text-black-900"
                        )}
                        onClick={
                          !selectedKanji?.is_published
                            ? handlePublished
                            : undefined
                        }
                      />
                    </Tooltip>
                  </div>
                </>
              )}

              <div className="flex items-center gap-4 border-l border-black-100 pl-4">
                <Tooltip text="Back">
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
      <AddKanjiModal
        isOpen={isOpenAddKanjiModal}
        onClose={() => setIsOpenAddKanjiModal(false)}
      />
    </>
  );
};

export default KanjiToolBar;

"use client";
import AddKanjiModal from "@/app/(pages)/kanji/components/AddKanjiModal";
import Tooltip from "@/components/common/Tooltip";
import { NEXT_STEP_SIZE, PREVIOUS_STEP_SIZE } from "@/constants/const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  getKanjiThunk,
  searchKanjiThunk,
} from "@/store/slices/kanji-word/thunk";
import { RootState } from "@/store/store";
import {
  CircleChevronLeft,
  CircleChevronRight,
  CirclePlus,
  CircleX,
  Maximize2Icon,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const { kanjiWord, maxKanjiId, minKanjiId, loading } = useAppSelector(
    (state: RootState) => state.kanjiWord
  );

  useEffect(() => {
    if (kanjiWord?.kanji_id && minKanjiId !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasPrevious(kanjiWord?.kanji_id > minKanjiId);
    }

    if (kanjiWord?.kanji_id && maxKanjiId !== null) {
      setHasNext(kanjiWord?.kanji_id < maxKanjiId);
    }
  }, [kanjiWord, minKanjiId, maxKanjiId]);

  const handleGetKanji = (step: number) => {
    if (!kanjiWord?.kanji_id) return;
    const newId = kanjiWord.kanji_id + step;
    if (newId < minKanjiId || newId > maxKanjiId) return;
    dispatch(getKanjiThunk(newId));
  };

  const handleSearch = () => {
    if (searchCharacter.trim()) {
      dispatch(searchKanjiThunk(searchCharacter))
        .unwrap()
        .then(() => console.log("Tìm thấy Kanji"))
        .catch(() => console.error("Không tìm thấy Kanji"));
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
          <Image src="/logo/logo-0.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">Kanji Dictionary</span>
          <Maximize2Icon className="w-6 h-6 text-black-400 cursor-pointer" />
        </div>

        <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
          {!isSearchVisible ? (
            <Tooltip text="Search">
              <Search
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={() => setIsSearchVisible(true)}
              />
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchCharacter}
                onChange={(e) => setSearchCharacter(e.target.value)}
                placeholder="Enter kanji"
                className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2"
              />
              <Tooltip text="Search Kanji">
                <Search
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-blue-300"
                  onClick={handleSearch}
                />
              </Tooltip>
              <Tooltip text="Cancel Search">
                <CircleX
                  className="w-8 h-8 text-black-400 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setIsSearchVisible(false);
                    setSearchCharacter("");
                  }}
                />
              </Tooltip>
            </div>
          )}

          <div className="flex items-center gap-4 border-l border-black-100 pl-4">
            <Tooltip text="Previous">
              <CircleChevronLeft
                className={`w-8 h-8 cursor-pointer ${
                  hasPrevious
                    ? "text-black-400 hover:text-black-900"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                onClick={
                  hasPrevious
                    ? () => handleGetKanji(PREVIOUS_STEP_SIZE)
                    : undefined
                }
              />
            </Tooltip>

            <Tooltip text="Next">
              <CircleChevronRight
                className={`w-8 h-8 text-black-400 cursor-pointer ${
                  hasNext
                    ? "text-black-400 hover:text-black-900"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                onClick={
                  hasNext ? () => handleGetKanji(NEXT_STEP_SIZE) : undefined
                }
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-4 border-l border-black-100 pl-4">
            <Tooltip text="Edit">
              <SquarePen
                className={`w-8 h-8 text-black-400 cursor-pointer ${
                  false
                    ? "text-black-400 hover:text-black-900"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                onClick={undefined}
              />
            </Tooltip>
            <Tooltip text="Add">
              <CirclePlus
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={() => setIsOpen(true)}
              />
            </Tooltip>
            <Tooltip text="Delete">
              <Trash2
                className={`w-8 h-8 text-black-400 cursor-pointer ${
                  false
                    ? "text-black-400 hover:text-black-900"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                onClick={undefined}
              />
            </Tooltip>
          </div>
        </div>
      </header>

      <AddKanjiModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Header;

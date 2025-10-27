"use client";
import AddKanjiModal from "@/app/(pages)/kanji/components/AddKanjiModal";
import Tooltip from "@/components/common/Tooltip";
import { NEXT_STEP_SIZE, PREVIOUS_STEP_SIZE } from "@/constants/const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getKanjiThunk } from "@/store/slices/kanji-word/thunk";
import { RootState } from "@/store/store";
import {
  CircleChevronLeft,
  CircleChevronRight,
  CirclePlus,
  Maximize2Icon,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { kanjiWord, loading } = useAppSelector(
    (state: RootState) => state.kanjiWord
  );

  const getKanji = (id: number | undefined, step: number) => {
    if (!id) {
      return;
    }

    dispatch(getKanjiThunk(id + step));
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
          <Tooltip text="Search">
            <Search className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900" />
          </Tooltip>
          <Tooltip text="Previous">
            <CircleChevronLeft
              className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
              onClick={() => getKanji(kanjiWord?.kanji_id, PREVIOUS_STEP_SIZE)}
            />
          </Tooltip>
          <Tooltip text="Next">
            <CircleChevronRight
              className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
              onClick={() => getKanji(kanjiWord?.kanji_id, NEXT_STEP_SIZE)}
            />
          </Tooltip>
          <div className="flex items-center gap-4 border-l border-black-100 pl-4">
            <Tooltip text="Edit">
              <SquarePen className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900" />
            </Tooltip>
            <Tooltip text="Add">
              <CirclePlus
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={() => setIsOpen(true)}
              />
            </Tooltip>
            <Tooltip text="Delete">
              <Trash2 className="w-8 h-8 text-black-400 cursor-pointer hover:text-red-500" />
            </Tooltip>
          </div>
        </div>
      </header>

      <AddKanjiModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Header;

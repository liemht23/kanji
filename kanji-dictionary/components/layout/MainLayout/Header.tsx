"use client";
import Tooltip from "@/components/common/Tooltip";
import {
  CircleChevronLeft,
  CircleChevronRight,
  Maximize2Icon,
  Search,
} from "lucide-react";
import Image from "next/image";

const Header = () => {
  return (
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
          <CircleChevronLeft className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900" />
        </Tooltip>
        <Tooltip text="Next">
          <CircleChevronRight className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900" />
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;

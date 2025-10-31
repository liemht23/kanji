"use client";
import Tooltip from "@/components/common/Tooltip";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import Image from "next/image";

const Navigation = ({
  isDocked,
  setIsDocked,
}: {
  isDocked: boolean;
  setIsDocked: (val: boolean) => void;
}) => {
  return (
    <>
      {isDocked ? (
        <div className="px-4 py-4 bg-black-0 shadow-sm h-full transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
            <Image src="/logo/logo-0.png" alt="Logo" width={40} height={40} />
            <Tooltip text="Expand navigation bar">
              <Maximize2Icon
                className="w-6 h-6 text-black-400 cursor-pointer hover:scale-110 transition"
                onClick={() => setIsDocked(false)}
              />
            </Tooltip>
          </div>
        </div>
      ) : (
        <nav className="pl-4 pt-2 absolute flex items-center justify-between mb-4 z-50 transition-all duration-200">
          <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
            <div className="relative w-8 h-8">
              <Image
                src="/logo/logo-0.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-xl font-bold">Kanji Dictionary</span>
            <Tooltip text="Collapse navigation bar">
              <Minimize2Icon
                className="w-6 h-6 text-black-400 cursor-pointer hover:scale-110 transition"
                onClick={() => setIsDocked(true)}
              />
            </Tooltip>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navigation;

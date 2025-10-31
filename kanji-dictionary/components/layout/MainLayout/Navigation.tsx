"use client";
import Tooltip from "@/components/common/Tooltip";
import { cn } from "@/utils/class-name";
import { Maximize2Icon, Menu, Minimize2Icon } from "lucide-react";
import Image from "next/image";

const Navigation = ({
  isDocked,
  isMobile,
  setIsDocked,
}: {
  isDocked: boolean;
  isMobile: boolean;
  setIsDocked: (val: boolean) => void;
}) => {
  return (
    <>
      {isDocked ? (
        <div className="px-4 py-4 bg-black-0 shadow-sm h-full transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
            <Image src="/logo/logo-0.png" alt="Logo" width={40} height={40} />
            <Tooltip position="bottom" text="Expand navigation bar">
              <Maximize2Icon
                className="w-6 h-6 text-black-400 cursor-pointer hover:scale-110 transition"
                onClick={() => setIsDocked(false)}
              />
            </Tooltip>
          </div>
        </div>
      ) : (
        <>
          {isMobile && (
            <nav className="absolute z-50 transition-all duration-200">
              <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
                <Tooltip text="Open Menu">
                  <Menu
                    className="w-5 h-5 text-black-400 cursor-pointer hover:scale-110 transition"
                    onClick={() => setIsDocked(true)}
                  />
                </Tooltip>
              </div>
            </nav>
          )}
          {!isMobile && (
            <nav className="pl-4 pt-2 absolute flex items-center justify-between mb-4 z-50 transition-all duration-200">
              <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
                <div className="relative w-8 h-8">
                  <Image
                    src="/logo/logo-0.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Kanji Dictionary</span>
                <Tooltip text="Collapse Navigation Bar">
                  <Minimize2Icon
                    className="w-6 h-6 text-black-400 cursor-pointer hover:scale-110 transition"
                    onClick={() => setIsDocked(true)}
                  />
                </Tooltip>
              </div>
            </nav>
          )}
        </>
      )}
    </>
  );
};

export default Navigation;

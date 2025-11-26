"use client";
import Tooltip from "@/components/common/Tooltip";
import { cn } from "@/utils/class-name";
import { Maximize2Icon, Menu, Minimize2Icon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Navigation = ({
  isDocked,
  isMobile,
  setIsDocked,
}: {
  isDocked: boolean;
  isMobile: boolean;
  setIsDocked: (val: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  // Handler to keep docked state when navigating
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
    // Do not change docked state
  };
  return (
    <>
      {isDocked ? (
        <div className="px-4 py-4 bg-black-0 shadow-sm h-full transition-all duration-200 flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Image src="/logo/logo-0.png" alt="Logo" width={40} height={40} />
            <Tooltip position="bottom" text="Collapse">
              <Minimize2Icon
                className="w-6 h-6 text-black-400 cursor-pointer hover:scale-110 transition"
                onClick={() => setIsDocked(false)}
              />
            </Tooltip>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            <Link
              href="/kanji"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition",
                pathname === "/kanji"
                  ? "bg-black-900 text-white"
                  : "hover:bg-black-100 text-black-900"
              )}
              onClick={handleNavClick("/kanji")}
            >
              LEARN KANJI
            </Link>
            <Link
              href="/vocab"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition",
                pathname === "/vocab"
                  ? "bg-black-900 text-white"
                  : "hover:bg-black-100 text-black-900"
              )}
              onClick={handleNavClick("/vocab")}
            >
              LEARN VOCAB
            </Link>
            <div className="flex-1" />
            <Link
              href="/login"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition mb-2",
                pathname === "/login"
                  ? "bg-black-900 text-white"
                  : "hover:text-red-500"
              )}
              style={{ marginTop: "auto" }}
              onClick={handleNavClick("/login")}
            >
              LOGOUT
            </Link>
          </nav>
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
            <nav className="absolute flex items-center justify-between mb-4 z-50 transition-all duration-200">
              <div className="flex items-center gap-4 bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
                <>
                  <div className="relative w-8 h-8">
                    <Image
                      src="/logo/logo-0.png"
                      alt="Logo"
                      fill
                      sizes="object-contain"
                    />
                  </div>
                  {pathname === "/kanji" && (
                    <span className="text-xl font-bold">LEARN KANJI</span>
                  )}
                  {pathname === "/vocab" && (
                    <span className="text-xl font-bold">LEARN VOCAB</span>
                  )}
                </>
                <Tooltip text="Expand">
                  <Maximize2Icon
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

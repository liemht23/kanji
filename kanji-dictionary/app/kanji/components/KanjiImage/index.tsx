import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/class-name";
import Spinner from "@/components/common/Spinner";

const KanjiImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isImgLoading, setIsImgLoading] = useState(true);

  return (
    <div className="relative w-full h-[21rem] flex items-center justify-center bg-black-100 rounded-2xl overflow-hidden">
      {isImgLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black-50/30 z-[999]">
          <Spinner />
        </div>
      )}
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-contain transition-opacity duration-500",
          isImgLoading ? "opacity-0" : "opacity-100"
        )}
        onLoadingComplete={() => setIsImgLoading(false)}
      />
    </div>
  );
};

export default KanjiImage;

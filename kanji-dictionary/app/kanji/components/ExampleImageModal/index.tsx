import { useLayout } from "@/app/context/LayoutContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ExampleImagePopupProps {
  images: string[];
  onClose: () => void;
}

const ExampleImagePopup = ({ images, onClose }: ExampleImagePopupProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setIsModalOpen } = useLayout();

  const nextImage = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % images.length),
    [images.length]
  );

  const prevImage = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    setIsModalOpen(true);
    return () => setIsModalOpen(false);
  }, [setIsModalOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextImage, prevImage, onClose]);

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={32} />
      </button>

      <div className="relative w-[80vw] h-[70vh] flex items-center justify-center">
        <button
          onClick={prevImage}
          className="absolute left-2 text-white hover:text-gray-300"
        >
          <ChevronLeft size={40} />
        </button>

        <Image
          src={images[currentIndex]}
          alt={`Kanji example ${currentIndex + 1}`}
          fill
          className="object-contain rounded-lg"
        />

        <button
          onClick={nextImage}
          className="absolute right-2 text-white hover:text-gray-300"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <p className="text-white mt-4">
        {currentIndex + 1}/{images.length}
      </p>
    </div>
  );
};

export default ExampleImagePopup;

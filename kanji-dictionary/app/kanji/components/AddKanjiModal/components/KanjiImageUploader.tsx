import React from "react";
import Image from "next/image";

interface KanjiImageUploaderProps {
  newMainPreview: string | null;
  existingImgUrl: string | null;
  isAllowUpload: boolean;
  removeMainImage: () => void;
  handleUploadKanjiImg: () => void;
  onPickMainImage: (file?: File) => void;
}

const KanjiImageUploader = ({
  newMainPreview,
  existingImgUrl,
  isAllowUpload,
  removeMainImage,
  handleUploadKanjiImg,
  onPickMainImage,
}: KanjiImageUploaderProps) => {
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onPickMainImage(f);
  };

  return (
    <div className="mb-5">
      <label
        htmlFor="kanji-image-upload"
        className="block mb-2 text-sm font-medium text-black-900"
      >
        Kanji Image
      </label>
      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden relative">
        {newMainPreview ? (
          <Image
            src={newMainPreview}
            alt="new preview"
            fill
            style={{ objectFit: "contain", borderRadius: "0.5rem" }}
            sizes="100vw"
            priority
          />
        ) : existingImgUrl ? (
          <Image
            src={existingImgUrl}
            alt="existing"
            fill
            style={{ objectFit: "contain", borderRadius: "0.5rem" }}
            sizes="100vw"
            priority
          />
        ) : (
          <span className="text-center text-gray-400">
            No preview available
          </span>
        )}
        {newMainPreview && (
          <button
            type="button"
            onClick={removeMainImage}
            className="absolute top-2 right-2 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
          >
            ✕
          </button>
        )}
      </div>
      {isAllowUpload && !newMainPreview && !existingImgUrl && (
        <div className="block mt-2 text-sm font-medium text-black-900">
          <span>No image found!</span>
          <button
            type="button"
            className={"text-blue-400 hover:text-blue-500 hover:underline"}
            onClick={handleUploadKanjiImg}
          >
            Upload
          </button>
        </div>
      )}
      <input
        id="kanji-image-upload"
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        disabled={!isAllowUpload || !!newMainPreview || !!existingImgUrl}
        onChange={handleMainImageChange}
      />
    </div>
  );
};

export default KanjiImageUploader;

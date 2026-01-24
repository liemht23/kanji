import React, { useRef } from "react";
import Image from "next/image";

interface ExampleImagesUploaderProps {
  existingExampleUrls: string[];
  newExamplePreviews: string[];
  newExampleFiles: File[];
  onPickExampleImages: (files: File[]) => void;
  removeExistingExampleAt: (idx: number) => void;
  removeNewExampleAt: (idx: number) => void;
}

const ExampleImagesUploader = ({
  existingExampleUrls,
  newExamplePreviews,
  newExampleFiles,
  onPickExampleImages,
  removeExistingExampleAt,
  removeNewExampleAt,
}: ExampleImagesUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    onPickExampleImages(files);
    // Reset input value to allow re-uploading the same files
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveNewExample = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeNewExampleAt(idx);
  };
  // Ref for input file to reset value after upload
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-5 px-4">
      <label
        htmlFor="example-images"
        className="block mb-2 text-sm font-medium text-black-900"
      >
        Example Images
      </label>
      <label
        htmlFor="example-images"
        className="flex flex-col items-center justify-center w-full min-h-24 border-2 border-dashed \
        border-gray-300 rounded-lg cursor-pointer bg-gray-50 \
        hover:bg-gray-100 transition-all duration-200 ease-in-out overflow-hidden"
        onClickCapture={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".stop-label-click")) e.preventDefault();
        }}
      >
        {existingExampleUrls.length > 0 || newExamplePreviews.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 p-2 w-full">
            {existingExampleUrls.map((src, idx) => (
              <div key={`old-${idx}`} className="relative">
                <Image
                  src={src}
                  alt={`existing-example-${idx}`}
                  width={64}
                  height={64}
                  style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                  className="w-full h-16 rounded-md border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExistingExampleAt(idx);
                  }}
                  className="stop-label-click absolute top-1 right-1 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
            {newExamplePreviews.map((src, idx) => (
              <div key={`new-${idx}`} className="relative">
                <Image
                  src={src}
                  alt={`new-example-${idx}`}
                  width={64}
                  height={64}
                  style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                  className="w-full h-16 rounded-md border"
                />
                <button
                  type="button"
                  onClick={(e) => handleRemoveNewExample(idx, e)}
                  className="stop-label-click absolute top-1 right-1 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <svg
              className="w-8 h-8 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-center text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>
              <br />
              <span>multiple images</span>
            </p>
          </>
        )}
        <input
          id="example-images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </label>
      {(existingExampleUrls.length > 0 || newExampleFiles.length > 0) && (
        <p className="mt-2 text-sm text-gray-600 text-center">
          {existingExampleUrls.length + newExampleFiles.length} file(s) total
        </p>
      )}
    </div>
  );
};

export default ExampleImagesUploader;

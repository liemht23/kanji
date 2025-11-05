"use client";
import Tooltip from "@/components/common/Tooltip";
import { CircleX, Pencil, SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddSampleKanjiModal from "../AddSampleKanjiModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { SampleVocab } from "@/types/sample-vocab";
import { KanjiData } from "@/types/kanji-word";
import { insertKanjiThunk } from "@/store/slices/kanji-card/thunk";
import { setCurrentKanjiId } from "@/store/slices/kanji-card";
import {
  clearListSampleVocab,
  removeSampleVocabFromList,
  setSampleVocab,
} from "@/store/slices/sample-vocab";
import { uploadImage } from "@/lib/upload";
import { BUCKET_EXAMPLE_IMAGES, BUCKET_KANJI_IMAGES } from "./const";
import { LEVEL_OPTION } from "../KanjiCard/const";
import { getLabel } from "@/utils/select-option";

interface AddKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddKanjiModal = ({ isOpen, onClose }: AddKanjiModalProps) => {
  const [isOpenAddSampleKanjiModal, setIsOpenAddSampleKanjiModal] =
    useState(false);
  const [kanjiImage, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const prevPreviewRef = useRef<string | null>(null);
  const { listSampleVocab } = useAppSelector(
    (state: RootState) => state.sampleVocab
  );
  const { kanjiWord } = useAppSelector((state: RootState) => state.kanjiCard);
  const dispatch = useAppDispatch();

  const handleEditSampleVocab = (sampleVocab: SampleVocab) => {
    dispatch(setSampleVocab(sampleVocab));
    setIsOpenAddSampleKanjiModal(true);
  };

  const handleDelete = (id: number) => {
    dispatch(removeSampleVocabFromList(id));
  };

  const handleSaveKanji = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const kanjiId = Number(formData.get("kanji_id"));
    const character = formData.get("character") as string;
    const on_reading = formData.get("on_reading") as string;
    const kun_reading = formData.get("kun_reading") as string;
    const chinese_character = formData.get("chinese_character") as string;
    const meaning = formData.get("meaning") as string;

    let img_url = "";
    if (kanjiImage) {
      try {
        img_url = await uploadImage(kanjiImage, BUCKET_KANJI_IMAGES);
      } catch (err) {
        console.error(err);
        alert("Upload kanji image failed");
      }
    }

    let example_images: string[] = [];
    if (imageFiles.length > 0) {
      try {
        const uploadedUrls = (
          await Promise.all(
            imageFiles.map(async (f) => {
              try {
                return await uploadImage(f, BUCKET_EXAMPLE_IMAGES);
              } catch {
                return null;
              }
            })
          )
        ).filter((url): url is string => Boolean(url));
        example_images = uploadedUrls;
      } catch (err) {
        console.error(err);
        alert("Upload example images failed");
      }
    }

    const kanjiData: KanjiData = {
      kanji_id: kanjiId,
      character: character,
      on_reading: on_reading,
      kun_reading: kun_reading,
      chinese_character: chinese_character,
      meaning: meaning,
      img_url: img_url,
      example: listSampleVocab,
      example_images: example_images,
    };

    dispatch(insertKanjiThunk(kanjiData))
      .unwrap()
      .then(() => {
        dispatch(setCurrentKanjiId(kanjiId));
        dispatch(clearListSampleVocab());
      });

    onClose();
  };

  const handleCancel = () => {
    onClose();
    dispatch(clearListSampleVocab());
  };

  // Clear preview and kanjiImage when modal closes, and revoke any object URL to avoid memory leaks
  useEffect(() => {
    if (!isOpen) {
      // Cleanup preview Kanji image
      if (prevPreviewRef.current) {
        URL.revokeObjectURL(prevPreviewRef.current);
        prevPreviewRef.current = null;
      }

      // Cleanup preview example images
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Deferred state reset (prevent from set State sync warning)
      const timeout = setTimeout(() => {
        setImagePreviews([]);
        setImageFiles([]);
        setFile(null);
        setPreview(null);
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [isOpen, imagePreviews]);

  // Revoke any leftover object URL on unmount
  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) {
        URL.revokeObjectURL(prevPreviewRef.current);
        prevPreviewRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 p-6">
          <header className="flex items-center justify-between pl-4 mb-4">
            <h2 className="text-xl font-semibold">ADD KANJI</h2>
            <Tooltip text="Close">
              <CircleX
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={handleCancel}
              />
            </Tooltip>
          </header>

          <form onSubmit={(e) => handleSaveKanji(e)}>
            <div className="grid grid-cols-12 mb-5">
              <div className="col-span-4">
                <div className="grid grid-cols-12">
                  <div className="col-span-6 px-4">
                    <div className="mb-5">
                      <label
                        htmlFor="kanji_id"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        No.
                      </label>
                      <input
                        type="text"
                        id="kanji_id"
                        name="kanji_id"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                          focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="1"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="on_reading"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        On Reading
                      </label>
                      <input
                        type="text"
                        id="on_reading"
                        name="on_reading"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="タツ"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="kanjiImage-upload"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Upload File
                      </label>

                      <label
                        htmlFor="kanjiImage-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed 
                        border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                        hover:bg-gray-100 transition-all duration-200 ease-in-out overflow-hidden"
                        onClickCapture={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest(".stop-label-click")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {preview ? (
                          <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt="preview"
                              className="object-contain w-full h-full rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (prevPreviewRef.current) {
                                  URL.revokeObjectURL(prevPreviewRef.current);
                                  prevPreviewRef.current = null;
                                }
                                setPreview(null);
                                setFile(null);
                              }}
                              className="stop-label-click absolute top-2 right-2 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
                            >
                              ✕
                            </button>
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
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              <br />
                              <span>or drag and drop</span>
                            </p>
                          </>
                        )}

                        <input
                          id="kanjiImage-upload"
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (!selectedFile) return;

                            setFile(selectedFile);

                            // If image then create preview URL
                            if (selectedFile.type.startsWith("image/")) {
                              // revoke previous preview if exists
                              if (prevPreviewRef.current) {
                                URL.revokeObjectURL(prevPreviewRef.current);
                              }
                              const url = URL.createObjectURL(selectedFile);
                              prevPreviewRef.current = url;
                              setPreview(url);
                            } else {
                              // revoke previous preview if switching to non-image
                              if (prevPreviewRef.current) {
                                URL.revokeObjectURL(prevPreviewRef.current);
                                prevPreviewRef.current = null;
                              }
                              setPreview(null);
                            }
                          }}
                        />
                      </label>

                      {kanjiImage && !preview && (
                        <p className="mt-2 text-sm text-gray-600 text-center">
                          {kanjiImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 px-4">
                    <div className="mb-5">
                      <label
                        htmlFor="character"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Character
                      </label>
                      <input
                        type="text"
                        id="character"
                        name="character"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="達"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="kun_reading"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Kun Reading
                      </label>
                      <input
                        type="text"
                        id="kun_reading"
                        name="kun_reading"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="たち"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="chinese_character"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Chinese Character
                      </label>
                      <input
                        type="text"
                        id="chinese_character"
                        name="chinese_character"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                      focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="ĐẠT"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="meaning"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Meaning
                      </label>
                      <input
                        type="text"
                        id="meaning"
                        name="meaning"
                        className="border border-black-400 text-black-900 text-sm rounded-lg
                      focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                        placeholder="tiễn"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5 px-4">
                  <label
                    htmlFor="example-images"
                    className="block mb-2 text-sm font-medium text-black-900"
                  >
                    Example Images
                  </label>

                  <label
                    htmlFor="example-images"
                    className="flex flex-col items-center justify-center w-full min-h-24 border-2 border-dashed 
                      border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                      hover:bg-gray-100 transition-all duration-200 ease-in-out overflow-hidden"
                    onClickCapture={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest(".stop-label-click")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`example-${idx}`}
                              className="object-cover w-full h-16 rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                // Revoke object URL
                                URL.revokeObjectURL(src);
                                setImagePreviews((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                                setImageFiles((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                              }}
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
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        if (files.length === 0) return;

                        const newPreviews = files.map((file) =>
                          URL.createObjectURL(file)
                        );

                        setImageFiles((prev) => [...prev, ...files]);
                        setImagePreviews((prev) => [...prev, ...newPreviews]);
                      }}
                    />
                  </label>

                  {imageFiles.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {imageFiles.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-8 px-4 border-l border-black-100 pl-4">
                <div className="flex items-start gap-2">
                  <div className="text-lg font-semibold">Example</div>
                  <Tooltip text="Add Sample Kanji">
                    <SquarePlus
                      className="w-6 h-6 text-black-400 cursor-pointer hover:text-black-900"
                      onClick={() => setIsOpenAddSampleKanjiModal(true)}
                    />
                  </Tooltip>
                </div>

                <div className="max-h-[316px] overflow-y-auto rounded-lg">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="text-center border border-gray-300 w-1/10">
                          No.
                        </th>
                        <th className="p-3 text-left border border-gray-300 w-3/10">
                          Sample Kanji
                        </th>
                        <th className="p-3 text-center border border-gray-300 w-1/10">
                          Level
                        </th>
                        <th className="p-3 text-left border border-gray-300 w-3/10">
                          Meaning
                        </th>
                        <th className="p-3 text-center border border-gray-300 w-1/5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSampleVocab.length === 0 ? (
                        <tr className="transition-colors duration-200 h-16">
                          <td
                            colSpan={5}
                            className="p-3 border border-gray-300 text-center"
                          >
                            No data
                          </td>
                        </tr>
                      ) : (
                        listSampleVocab.map(
                          (sampleVocab: SampleVocab, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 transition-colors duration-200"
                              >
                                <td className="p-3 text-center border border-gray-300">
                                  {sampleVocab.id}
                                </td>
                                <td className="p-3 border border-gray-300">
                                  {sampleVocab.vocab}
                                </td>
                                <td className="p-3 text-center border border-gray-300">
                                  {getLabel(LEVEL_OPTION, sampleVocab.level)}
                                </td>
                                <td className="p-3 text-center border border-gray-300">
                                  {sampleVocab.meaning}
                                </td>
                                <td className="p-3 border border-gray-300 text-center">
                                  <div className="flex justify-center gap-4">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleEditSampleVocab(sampleVocab);
                                      }}
                                      className="p-1 text-blue-600 hover:text-blue-800"
                                    >
                                      <Pencil size={18} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(sampleVocab.id);
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-black-400 font-medium border border-black-400 rounded-xl
               hover:text-black-900 hover:border-black-900 
               transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-black-0 bg-blue-400 font-medium border border-black-400 rounded-xl
               hover:border-black-900
               transition-all duration-200 ease-in-out"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <AddSampleKanjiModal
        isOpen={isOpenAddSampleKanjiModal}
        onClose={() => setIsOpenAddSampleKanjiModal(false)}
      />
    </>
  );
};

export default AddKanjiModal;

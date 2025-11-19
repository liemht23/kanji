"use client";
import Tooltip from "@/components/common/Tooltip";
import { CircleX, Pencil, SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddSampleKanjiModal from "../AddSampleKanjiModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { Vocab } from "@/types/vocab";
import { KanjiData } from "@/types/kanji-word";
import {
  getKanjiThunk,
  upsertKanjiThunk,
} from "@/store/slices/kanji-card/thunk";
import {
  clearListSampleVocab,
  removeSampleVocabFromList,
  setListSampleVocal,
  setSampleVocab,
} from "@/store/slices/sample-vocab";
import { uploadImage } from "@/lib/upload";
import {
  BUCKET_EXAMPLE_IMAGES,
  BUCKET_KANJI_IMAGES,
} from "@/constants/kanji-const";
import { getLabel } from "@/utils/select-option";
import { cn } from "@/utils/class-name";
import { LEVEL_OPTION } from "@/constants/common-const";

interface AddKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddKanjiModal = ({ isOpen, onClose }: AddKanjiModalProps) => {
  const [isOpenAddSampleKanjiModal, setIsOpenAddSampleKanjiModal] =
    useState(false);
  const { listSampleVocab } = useAppSelector(
    (state: RootState) => state.sampleVocab
  );
  const { editedKanji } = useAppSelector((state: RootState) => state.kanjiCard);
  const isEditMode = Boolean(editedKanji);

  // ------- Form Fields (controlled) -------
  const [kanjiId, setKanjiId] = useState<number | "">("");
  const [character, setCharacter] = useState("");
  const [onReading, setOnReading] = useState("");
  const [kunReading, setKunReading] = useState("");
  const [chineseCharacter, setChineseCharacter] = useState("");
  const [meaning, setMeaning] = useState("");

  // ------- Main Image -------
  const [existingImgUrl, setExistingImgUrl] = useState<string | null>(null); // URL from server (edit mode)
  const [newMainFile, setNewMainFile] = useState<File | null>(null);
  const [newMainPreview, setNewMainPreview] = useState<string | null>(null); // Revoke object URL

  // ------- Example Images -------
  const [existingExampleUrls, setExistingExampleUrls] = useState<string[]>([]); // URL server
  const [newExampleFiles, setNewExampleFiles] = useState<File[]>([]);
  const [newExamplePreviews, setNewExamplePreviews] = useState<string[]>([]); // Revoke object URLs

  const dispatch = useAppDispatch();

  const onPickMainImage = (file?: File) => {
    // Clear the previous preview if it exists
    if (newMainPreview) URL.revokeObjectURL(newMainPreview);

    // If no file was selected, reset both file and preview
    if (!file) {
      setNewMainFile(null);
      setNewMainPreview(null);
      return;
    }

    // Save the selected file and create a preview URL
    setNewMainFile(file);
    setNewMainPreview(URL.createObjectURL(file));

    // When a new file is selected, the existing server image is visually replaced,
    // but we don't actually remove `existingImgUrl` until the form is submitted
    // (so that we can still cancel and revert safely).
  };

  const onPickExampleImages = (files: File[]) => {
    // If no files were selected, do nothing
    if (!files.length) return;

    // Create temporary preview URLs for each selected file
    const previews = files.map((f) => URL.createObjectURL(f));

    // Append new files and their previews to the existing ones
    setNewExampleFiles((prev) => [...prev, ...files]);
    setNewExamplePreviews((prev) => [...prev, ...previews]);
  };

  const removeMainImage = () => {
    // Revoke the object URL to free memory
    if (newMainPreview) URL.revokeObjectURL(newMainPreview);

    // Clear the selected file and its preview
    setNewMainFile(null);
    setNewMainPreview(null);

    // Do not touch `existingImgUrl` — the server image remains intact
  };

  const removeExistingMainImage = () => {
    // Mark the existing server image as removed
    // (so if no new image is selected before submitting, img_url will be set to "")
    setExistingImgUrl(null);
  };

  const removeExistingExampleAt = (idx: number) => {
    // Remove the existing example image at the given index
    // (this only affects the local state — the change is finalized on submit)
    setExistingExampleUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewExampleAt = (idx: number) => {
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(newExamplePreviews[idx]);

    // Remove the selected preview and file at the given index
    setNewExamplePreviews((prev) => prev.filter((_, i) => i !== idx));
    setNewExampleFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditSampleVocab = (sampleVocab: Vocab) => {
    dispatch(setSampleVocab(sampleVocab));
    setIsOpenAddSampleKanjiModal(true);
  };

  const handleDeleteSampleVocab = (id: number) => {
    dispatch(removeSampleVocabFromList(id));
  };

  const handleSaveKanji = async () => {
    try {
      // --- Upload main kanji image ---
      let img_url = existingImgUrl || "";
      if (newMainFile) {
        try {
          img_url = await uploadImage(newMainFile, BUCKET_KANJI_IMAGES);
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(msg);
          alert(`Upload kanji image failed: ${msg}`);
        }
      } else if (existingImgUrl === null) {
        // User removed existing image and didn't add a new one
        img_url = "";
      }

      // --- Upload example images ---
      const example_images: string[] = [...existingExampleUrls];
      if (newExampleFiles.length > 0) {
        try {
          const uploadedUrls = (
            await Promise.all(
              newExampleFiles.map(async (f) => {
                try {
                  return await uploadImage(f, BUCKET_EXAMPLE_IMAGES);
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : JSON.stringify(err);
                  console.error(msg);
                  return null;
                }
              })
            )
          ).filter((url): url is string => Boolean(url));
          example_images.push(...uploadedUrls);
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(msg);
          alert(`Upload example images failed: ${msg}`);
        }
      }

      // --- Build KanjiData ---
      const kanjiData: KanjiData = {
        kanji_id: Number(kanjiId),
        character,
        on_reading: onReading,
        kun_reading: kunReading,
        chinese_character: chineseCharacter,
        meaning,
        img_url,
        example: listSampleVocab,
        example_images,
        is_official: false,
      };

      // --- Dispatch insert or update thunk ---
      await dispatch(
        upsertKanjiThunk({ data: kanjiData, isEdit: isEditMode })
      ).unwrap();

      dispatch(clearListSampleVocab());
      dispatch(getKanjiThunk(Number(kanjiId)));
      onClose();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error(msg);
      alert(`Save failed: ${msg}`);
    }
  };

  const handleCancel = () => {
    onClose();
    dispatch(clearListSampleVocab());
  };

  // Cleanup previews and temporary files when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Revoke preview URLs to free memory
      if (newMainPreview) URL.revokeObjectURL(newMainPreview);
      newExamplePreviews.forEach((u) => URL.revokeObjectURL(u));
      // Use a microtask (or next tick) to avoid synchronous state updates inside effect
      setTimeout(() => {
        setNewMainPreview(null);
        setNewExamplePreviews([]);
        setNewMainFile(null);
        setNewExampleFiles([]);
      }, 0);
    }
    // Add dependencies since we reference them
  }, [isOpen, newMainPreview, newExamplePreviews]);

  // Handle form setup when modal opens (edit vs add)
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editedKanji) {
      // Defer the state updates to avoid cascading render warning
      setTimeout(() => {
        // Prefill fields
        setKanjiId(editedKanji.kanji_id);
        setCharacter(editedKanji.character);
        setOnReading(editedKanji.on_reading);
        setKunReading(editedKanji.kun_reading);
        setChineseCharacter(editedKanji.chinese_character);
        setMeaning(editedKanji?.meaning ?? "");

        // Main image
        setExistingImgUrl(editedKanji.img_url || null);
        setNewMainFile(null);
        setNewMainPreview(null);

        // Example images
        setExistingExampleUrls(editedKanji.example_images ?? []);
        setNewExampleFiles([]);
        setNewExamplePreviews([]);

        // Prefill vocab list
        dispatch(clearListSampleVocab());
        dispatch(setListSampleVocal(editedKanji.example || []));
      }, 0);
    } else {
      // Add mode → reset everything
      setTimeout(() => {
        setKanjiId("");
        setCharacter("");
        setOnReading("");
        setKunReading("");
        setChineseCharacter("");
        setMeaning("");

        setExistingImgUrl(null);
        setNewMainFile(null);
        setNewMainPreview(null);

        setExistingExampleUrls([]);
        setNewExampleFiles([]);
        setNewExamplePreviews([]);

        dispatch(clearListSampleVocab());
      }, 0);
    }
  }, [isOpen, isEditMode, editedKanji, dispatch]);

  if (!isOpen) return;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 p-6">
          <header className="flex items-center justify-between pl-4 mb-4">
            <h2 className="text-xl font-semibold">
              {isEditMode ? "EDIT KANJI" : "ADD KANJI"}
            </h2>
            <Tooltip text="Close">
              <CircleX
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={handleCancel}
              />
            </Tooltip>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveKanji();
            }}
          >
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
                        className={cn(
                          "border border-black-400 text-black-900 text-sm rounded-lg focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5",
                          isEditMode ? "bg-black-100" : ""
                        )}
                        placeholder="1"
                        value={kanjiId}
                        onChange={(e) =>
                          setKanjiId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        disabled={isEditMode}
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
                        value={onReading}
                        onChange={(e) => setOnReading(e.target.value)}
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
                          if (target.closest(".stop-label-click"))
                            e.preventDefault();
                        }}
                      >
                        {newMainPreview ? (
                          <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={newMainPreview}
                              alt="new preview"
                              className="object-contain w-full h-full rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMainImage();
                              }}
                              className="stop-label-click absolute top-2 right-2 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
                            >
                              ✕
                            </button>
                          </div>
                        ) : existingImgUrl ? (
                          <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={existingImgUrl}
                              alt="existing"
                              className="object-contain w-full h-full rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExistingMainImage();
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
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.type.startsWith("image/")) onPickMainImage(f);
                            else onPickMainImage(f); // skip preview if PDF
                          }}
                        />
                      </label>

                      {newMainFile && !newMainPreview && (
                        <p className="mt-2 text-sm text-gray-600 text-center">
                          {newMainFile.name}
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
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
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
                        value={kunReading}
                        onChange={(e) => setKunReading(e.target.value)}
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
                        value={chineseCharacter}
                        onChange={(e) => setChineseCharacter(e.target.value)}
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
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
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
                      if (target.closest(".stop-label-click"))
                        e.preventDefault();
                    }}
                  >
                    {existingExampleUrls.length > 0 ||
                    newExamplePreviews.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 p-2 w-full">
                        {/* Old image(from server) */}
                        {existingExampleUrls.map((src, idx) => (
                          <div key={`old-${idx}`} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`existing-example-${idx}`}
                              className="object-cover w-full h-16 rounded-md border"
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

                        {/* New images (object URL) */}
                        {newExamplePreviews.map((src, idx) => (
                          <div key={`new-${idx}`} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`new-example-${idx}`}
                              className="object-cover w-full h-16 rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNewExampleAt(idx);
                              }}
                              className="stop-label-click absolute top-1 right-1 bg-black/60 text-white text-sm rounded-full px-1 hover:bg-black/80"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* --- Empty --- */
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
                        onPickExampleImages(files);
                      }}
                    />
                  </label>

                  {(existingExampleUrls.length > 0 ||
                    newExampleFiles.length > 0) && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {existingExampleUrls.length + newExampleFiles.length}{" "}
                      file(s) total
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

                <div className="max-h-[530px] overflow-y-auto rounded-lg">
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
                          (sampleVocab: Vocab, index: number) => {
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
                                        handleDeleteSampleVocab(sampleVocab.id);
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

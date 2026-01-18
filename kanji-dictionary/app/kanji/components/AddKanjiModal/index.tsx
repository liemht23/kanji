"use client";
import Tooltip from "@/components/common/Tooltip";
import {
  CircleX,
  FileSearch,
  FileUp,
  Pencil,
  SquarePlus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddSampleKanjiModal from "../AddSampleKanjiModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { Vocab } from "@/types/vocab";
import { Kanji } from "@/types/kanji";
import { uploadImage } from "@/lib/upload";
import {
  BUCKET_EXAMPLE_IMAGES,
  BUCKET_KANJI_IMAGES,
} from "@/constants/kanji-const";
import { getLabel } from "@/utils/select-option";
import { cn } from "@/utils/class-name";
import { LEVEL_OPTION } from "@/constants/common-const";
import {
  clearListSampleVocab,
  removeSampleVocabFromList,
  setListSampleVocab,
  setSampleVocab,
  setSelectedKanji,
  setEditedKanji,
} from "@/store/slices/kanji-collection";
import {
  getKanjiByCollectionIdThunk,
  getKanjiImageUrlThunk,
  insertKanjiImageThunk,
  upsertKanjiThunk,
} from "@/store/slices/kanji-collection/thunk";
import { KanjiImages } from "@/types/kanji-images";

interface AddKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddKanjiModal = ({ isOpen, onClose }: AddKanjiModalProps) => {
  const [isOpenAddSampleKanjiModal, setIsOpenAddSampleKanjiModal] =
    useState(false);
  // Find kanji image
  const [searchKanji, setSearchKanji] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isAllowUpload, setIsAllowUpload] = useState(false);
  const { editedKanji, selectedKanji, listSampleVocab, selectedCollection } =
    useAppSelector((state: RootState) => state.kanji);
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
    // Disable upload button
    setIsAllowUpload(false);
    // Clear search
    setSearchKanji("");
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
    setIsAllowUpload(false);
    // Reset input file to allow re-upload
    const input = document.getElementById(
      "kanjiImage-upload"
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const removeExistingMainImage = () => {
    setExistingImgUrl(null);
    setIsAllowUpload(false);
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
      let img_url = "";
      if (newMainFile) {
        // If user uploads a new file, upload it to the bucket
        try {
          img_url = await uploadImage(newMainFile, BUCKET_KANJI_IMAGES);
          // Then insert into table kanji_images
          const kanjiImg: KanjiImages = {
            id: "", // Generate or assign an ID as needed
            kanji: character,
            url: img_url,
          };
          await dispatch(insertKanjiImageThunk(kanjiImg)).unwrap();
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(msg);
          alert(`Upload kanji image failed: ${msg}`);
        }
      } else if (existingImgUrl) {
        // If using image from DB (found or already exists)
        img_url = existingImgUrl;
      } else {
        // No image available
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

      if (!selectedCollection) {
        return;
      }
      // --- Build Kanji ---
      const kanjiData: Kanji = {
        id: isEditMode && editedKanji ? editedKanji.id : undefined,
        kanji_id: Number(kanjiId),
        character,
        on_reading: onReading,
        kun_reading: kunReading,
        chinese_character: chineseCharacter,
        meaning,
        img_url,
        example: listSampleVocab,
        example_images,
        is_published: false,
        collection_id: selectedCollection?.id,
      };

      // --- Dispatch insert or update thunk ---
      await dispatch(upsertKanjiThunk({ data: kanjiData, isEdit: isEditMode }))
        .unwrap()
        .then((res) => {
          // Clear list sample vocab
          dispatch(clearListSampleVocab());
          // Refresh the kanji list
          if (selectedCollection) {
            dispatch(getKanjiByCollectionIdThunk(selectedCollection.id));
          }
          dispatch(setSelectedKanji(res));
          dispatch(setEditedKanji(null));
        });

      onClose();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error(msg);
      alert(`Save failed: ${msg}`);
    }
  };

  const handleCancel = () => {
    dispatch(clearListSampleVocab());
    dispatch(setEditedKanji(null));
    onClose();
  };

  const handleOnBlur = async () => {
    if (character && !newMainPreview && !existingImgUrl) {
      setSearchLoading(true);
      try {
        const url = await dispatch(getKanjiImageUrlThunk(character)).unwrap();
        if (url) {
          setExistingImgUrl(url);
          setIsAllowUpload(false);
        } else {
          setIsAllowUpload(true);
        }
      } catch {
        setIsAllowUpload(true);
      }
      setSearchLoading(false);
    }
  };

  const handleSearchKanjiImg = async () => {
    setSearchLoading(true);
    try {
      const url = await dispatch(getKanjiImageUrlThunk(searchKanji)).unwrap();
      if (url) {
        setExistingImgUrl(url);
        setIsAllowUpload(false);
      } else {
        alert("Kanji image not found! Please upload a new image.");
        setIsAllowUpload(true);
      }
    } catch (err) {
      alert("Error searching for image!");
      setIsAllowUpload(true);
    }
    setSearchLoading(false);
  };

  const handleUploadKanjiImg = () => {
    // focus input file
    const input = document.getElementById("kanjiImage-upload");
    if (input) input.click();
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
        setSearchKanji("");
        setIsAllowUpload(false);
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
        dispatch(setListSampleVocab(editedKanji.example || []));
        setSearchKanji("");
        setIsAllowUpload(false);
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
        setSearchKanji("");
        setIsAllowUpload(false);
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

                    {/* Preview is always displayed */}
                    <div className="mb-5">
                      <label
                        htmlFor="kanji-search"
                        className="block mb-2 text-sm font-medium text-black-900"
                      >
                        Kanji Image
                      </label>
                      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden relative">
                        {newMainPreview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={newMainPreview}
                              alt="new preview"
                              className="object-contain w-full h-full rounded-lg"
                            />
                          </>
                        ) : existingImgUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={existingImgUrl}
                              alt="existing"
                              className="object-contain w-full h-full rounded-lg"
                            />
                          </>
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
                            className={
                              "text-blue-400 hover:text-blue-500 hover:underline"
                            }
                            onClick={handleUploadKanjiImg}
                          >
                            Upload
                          </button>
                        </div>
                      )}

                      <input
                        id="kanjiImage-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        disabled={
                          !isAllowUpload || !!newMainPreview || !!existingImgUrl
                        }
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          onPickMainImage(f);
                        }}
                      />
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
                        onChange={(e) => {
                          setCharacter(e.target.value);
                          setExistingImgUrl(null);
                          if (newMainPreview) {
                            URL.revokeObjectURL(newMainPreview);
                            setNewMainPreview(null);
                          }
                        }}
                        onBlur={handleOnBlur}
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

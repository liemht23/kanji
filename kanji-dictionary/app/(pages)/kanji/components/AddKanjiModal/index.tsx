"use client";
import Tooltip from "@/components/common/Tooltip";
import { CircleX, Pencil, SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddSampleKanjiModal from "../AddSampleKanjiModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { WordPart } from "@/types/word-part";
import { KanjiData } from "@/types/kanji-word";
import { insertKanjiThunk } from "@/store/slices/kanji-word/thunk";
import { setCurrentKanjiId } from "@/store/slices/kanji-word";
import { clearListWordParts } from "@/store/slices/word-parts";
import { uploadImage } from "@/lib/upload";

interface AddKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddKanjiModal = ({ isOpen, onClose }: AddKanjiModalProps) => {
  const [isOpenAddSampleKanjiModal, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const prevPreviewRef = useRef<string | null>(null);
  const listWordParts = useAppSelector(
    (state: RootState) => state.wordParts.listWordParts
  );
  const dispatch = useAppDispatch();

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
    if (file) {
      try {
        img_url = await uploadImage(file);
      } catch (err) {
        console.error(err);
        alert("Upload ảnh thất bại!");
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
      example: listWordParts,
      example_images: [],
    };
    dispatch(insertKanjiThunk(kanjiData))
      .unwrap()
      .then(() => {
        dispatch(setCurrentKanjiId(kanjiId));
        dispatch(clearListWordParts());
      });

    onClose();
  };

  // Clear preview and file when modal closes, and revoke any object URL to avoid memory leaks
  useEffect(() => {
    if (!isOpen) {
      if (prevPreviewRef.current) {
        URL.revokeObjectURL(prevPreviewRef.current);
        prevPreviewRef.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFile(null);
      setPreview(null);
    }
  }, [isOpen]);

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
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
          <header className="flex items-center justify-between pl-4 mb-4">
            <h2 className="text-xl font-semibold">ADD KANJI</h2>
            <Tooltip text="Close">
              <CircleX
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={onClose}
              />
            </Tooltip>
          </header>

          <form onSubmit={(e) => handleSaveKanji(e)}>
            <div className="grid grid-cols-12 mb-5">
              <div className="col-span-3 px-4">
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
                    htmlFor="file-upload"
                    className="block mb-2 text-sm font-medium text-black-900"
                  >
                    Upload File
                  </label>

                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed 
                    border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                    hover:bg-gray-100 transition-all duration-200 ease-in-out overflow-hidden"
                  >
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="preview"
                        className="object-contain w-full h-full rounded-lg"
                      />
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
                          <span>or drag and drop</span>
                        </p>
                      </>
                    )}

                    <input
                      id="file-upload"
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

                  {file && !preview && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-3 px-4">
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

              <div className="col-span-6 px-4 border-l border-black-100 pl-4">
                <div className="flex items-start gap-2">
                  <div className="text-lg font-semibold">Example</div>
                  <Tooltip text="Add Sample Kanji">
                    <SquarePlus
                      className="w-6 h-6 text-black-400 cursor-pointer hover:text-black-900"
                      onClick={() => setIsOpen(true)}
                    />
                  </Tooltip>
                </div>

                <div className="max-h-[316px] overflow-y-auto rounded-lg">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 text-left border border-gray-300 w-3/5">
                          Sample Kanji
                        </th>
                        <th className="p-3 text-center border border-gray-300 w-2/5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listWordParts.length === 0 ? (
                        <tr className="transition-colors duration-200 h-16">
                          <td
                            colSpan={2}
                            className="p-3 border border-gray-300 text-center"
                          >
                            No data
                          </td>
                        </tr>
                      ) : (
                        listWordParts.map(
                          (wordPartArr: WordPart[], index: number) => {
                            const sortedWords = [...wordPartArr]
                              .sort((a, b) => a.id - b.id)
                              .map((item) => item.word);

                            return (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 transition-colors duration-200"
                              >
                                <td className="p-3 border border-gray-300">
                                  {sortedWords.join("")}
                                </td>
                                <td className="p-3 border border-gray-300 text-center">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      // onClick={() => handleEdit(wordPart)}
                                      className="p-1 text-blue-600 hover:text-blue-800"
                                    >
                                      <Pencil size={18} />
                                    </button>
                                    <button
                                      // onClick={() =>
                                      //   handleDelete(wordPart.id as number)
                                      // }
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
                onClick={onClose}
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
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default AddKanjiModal;

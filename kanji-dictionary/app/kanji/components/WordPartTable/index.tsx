import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { READING_TYPE } from "@/enum/common-enum";
import { getLabel, Option } from "@/utils/select-option";
import { WordPart } from "@/types/vocab";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { setWordPart, removeWordPart } from "@/store/slices/sample-vocab";
import { READING_TYPE_OPTION } from "@/constants/common-const";

const WordPartTable = () => {
  const dispatch = useAppDispatch();
  const { word_parts } = useAppSelector(
    (state: RootState) => state.sampleVocab.currentSampleVocab
  );
  const [editData, setEditData] = useState<WordPart | null>(null);

  const handleEdit = (wordPart: WordPart) => {
    setEditData(wordPart);
  };

  const handleSave = () => {
    dispatch(setWordPart(editData));
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    dispatch(removeWordPart(id));
    setEditData(null);
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        List Word Parts
      </h2>

      <div className="max-h-[316px] overflow-y-auto rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr className="h-16">
              <th className="p-3 text-left border border-gray-300 w-1/10">
                Index
              </th>
              <th className="p-3 text-left border border-gray-300 w-1/5">
                Word
              </th>
              <th className="p-3 text-left border border-gray-300 w-3/10">
                Pronun
              </th>
              <th className="p-3 text-left border border-gray-300 w-1/5">
                Type
              </th>
              <th className="p-3 text-center border border-gray-300 w-1/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {word_parts.length === 0 ? (
              <tr className="transition-colors duration-200 h-16">
                <td
                  colSpan={5}
                  className="p-3 border border-gray-300 text-center"
                >
                  No data
                </td>
              </tr>
            ) : (
              word_parts.map((wordPart) => (
                <tr
                  key={wordPart.id}
                  className="hover:bg-gray-100 transition-colors duration-200 h-16"
                >
                  <td className="p-3 border border-gray-300">{wordPart.id}</td>
                  <td className="p-3 border border-gray-300">
                    {editData?.id === wordPart.id ? (
                      <input
                        type="text"
                        value={editData.word}
                        onChange={(e) =>
                          setEditData({ ...editData, word: e.target.value })
                        }
                        className="border border-gray-400 rounded-md p-1 w-full"
                      />
                    ) : (
                      wordPart.word
                    )}
                  </td>

                  <td className="p-3 border border-gray-300">
                    {editData?.id === wordPart.id ? (
                      <input
                        type="text"
                        value={editData.pronun}
                        onChange={(e) =>
                          setEditData({ ...editData, pronun: e.target.value })
                        }
                        className="border border-gray-400 rounded-md p-1 w-full"
                      />
                    ) : (
                      wordPart.pronun
                    )}
                  </td>

                  <td className="p-3 border border-gray-300">
                    {editData?.id === wordPart.id ? (
                      <div>
                        <select
                          id="readingType"
                          value={editData.reading_type}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              reading_type: Number(
                                e.target.value
                              ) as READING_TYPE,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          {READING_TYPE_OPTION.map(
                            (option: Option, index: number) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    ) : (
                      getLabel(READING_TYPE_OPTION, wordPart.reading_type)
                    )}
                  </td>

                  <td className="p-3 border border-gray-300 text-center">
                    {editData?.id === wordPart.id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSave}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditData(null)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(wordPart)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(wordPart.id as number)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordPartTable;

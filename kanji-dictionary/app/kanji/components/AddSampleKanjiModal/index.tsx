import Tooltip from "@/components/common/Tooltip";
import { CircleX } from "lucide-react";
import WordPart from "../WordPart";
import WordPartTable from "../WordPartTable";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  clearSampleVocab,
  setSampleVocabToList,
  setLevel,
  setMeaning,
} from "@/store/slices/sample-vocab";
import { LEVEL_OPTION } from "../KanjiCard/const";
import { Option } from "@/utils/select-option";
import { RootState } from "@/store/store";
import { useEffect } from "react";

interface AddSampleKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSampleKanjiModal = ({ isOpen, onClose }: AddSampleKanjiModalProps) => {
  const currentSampleVocab = useAppSelector(
    (state: RootState) => state.sampleVocab.currentSampleVocab
  );
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    onClose();
    dispatch(clearSampleVocab());
  };

  const handleSave = () => {
    if (!currentSampleVocab.level) {
      alert("Chọn level");
      return;
    }
    if (!currentSampleVocab.meaning) {
      alert("Nhập meaning");
      return;
    }
    if (currentSampleVocab.wordParts?.length == 0) {
      alert("Nhập từ");
      return;
    }
    dispatch(setSampleVocabToList());
    dispatch(clearSampleVocab());
    onClose();
  };

  useEffect(() => {}, [dispatch, currentSampleVocab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ADD SAMPLE VOCAB</h2>
          <Tooltip text="Close">
            <CircleX
              className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
              onClick={handleCancel}
            />
          </Tooltip>
        </header>

        <div className="flex items-center justify-start gap-4 mb-4">
          <div className="w-[10%]">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">Level</h2>
            <select
              id="level"
              name="level"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                focus:ring-blue-500 focus:border-blue-500 block p-2.5 
                                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={currentSampleVocab.level}
              onChange={(e) => {
                dispatch(setLevel(Number(e.target.value)));
              }}
            >
              {LEVEL_OPTION.map((option: Option, index: number) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[50%]">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Meaning
            </h2>
            <input
              type="text"
              id="meaning"
              name="meaning"
              className="border border-black-400 text-black-900 text-sm rounded-lg
                          focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter the meaning of this vocab"
              value={currentSampleVocab.meaning ?? ""}
              required
              onChange={(e) => dispatch(setMeaning(e.target.value))}
            />
          </div>
        </div>

        <WordPartTable />

        <WordPart />

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
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-black-0 bg-blue-400 font-medium border border-black-400 rounded-xl
               hover:border-black-900
               transition-all duration-200 ease-in-out"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSampleKanjiModal;

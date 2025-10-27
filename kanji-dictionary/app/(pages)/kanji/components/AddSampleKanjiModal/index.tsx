import Tooltip from "@/components/common/Tooltip";
import { CircleX } from "lucide-react";
import WordPart from "../WordPart";
import WordPartTable from "../WordPartTable";
import { useAppDispatch } from "@/store/hook";
import { clearWordParts, setListWordParts } from "@/store/slices/word-parts";

interface AddSampleKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSampleKanjiModal = ({ isOpen, onClose }: AddSampleKanjiModalProps) => {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    onClose();
    dispatch(clearWordParts());
  };

  const handleSave = () => {
    onClose();
    dispatch(setListWordParts());
    dispatch(clearWordParts());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ADD SAMPLE</h2>
          <Tooltip text="Close">
            <CircleX
              className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
              onClick={handleCancel}
            />
          </Tooltip>
        </header>

        <WordPartTable />
        <br />
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

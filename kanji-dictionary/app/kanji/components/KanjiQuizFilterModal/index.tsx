import { useState, useEffect, useRef } from "react";
import "./index.css";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setOpenQuiz } from "@/store/slices/kanji-collection";
import { CircleX } from "lucide-react";
import Tooltip from "@/components/common/Tooltip";
import GradientSlider from "@/components/common/GradientSlider";

interface KanjiQuizFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KanjiQuizFilterModal = ({
  isOpen,
  onClose,
}: KanjiQuizFilterModalProps) => {
  const dispatch = useAppDispatch();
  const { listQuiz } = useAppSelector((state) => state.kanji);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [numQuestions, setNumQuestions] = useState(listQuiz.length);

  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStart = () => {
    dispatch(
      setOpenQuiz({
        isOpenQuiz: true,
        timePerQuestion,
        numQuestions,
      })
    );
    onClose();
  };

  // Modal style and animation identical to KanjiListModal (no overlay, just modal)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 p-8 border border-gray-200 min-w-[340px] transition-opacity transition-transform duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-16"
        }`}
      >
        <div className="absolute top-4 right-4">
          <Tooltip text="Close">
            <CircleX
              className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
              onClick={onClose}
            />
          </Tooltip>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">Quiz Settings</h2>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-800">
            Number of seconds per question
            <span className="ml-2 text-xs text-gray-400">(seconds)</span>
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 min-w-[28px] text-left text-center">
              10
            </span>
            <div className="flex-1">
              <GradientSlider
                min={10}
                max={60}
                value={timePerQuestion}
                onChange={setTimePerQuestion}
                startColor="#00B0F0"
                endColor="#0090c0"
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[28px] text-right text-center">
              60
            </span>
            <span className="ml-2 px-2 py-1 rounded-full font-bold text-base w-[56px] text-center border border-blue-200 shadow-sm bg-blue-50 text-blue-700 border-blue-300">
              {timePerQuestion}
            </span>
          </div>
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-gray-800">
            Number of questions
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 min-w-[28px] text-left text-center">
              1
            </span>
            <div className="flex-1">
              <GradientSlider
                min={1}
                max={listQuiz.length}
                value={numQuestions}
                onChange={setNumQuestions}
                startColor="#86efac"
                endColor="#16a34a"
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[28px] text-right text-center">
              {listQuiz.length}
            </span>
            <span className="ml-2 px-2 py-1 rounded-full font-bold text-base w-[56px] text-center border border-green-200 shadow-sm bg-green-50 text-green-700 border-green-300">
              {numQuestions}
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2.5 text-white font-semibold rounded-full bg-[#00B0F0] shadow-md focus:outline-none focus:ring-2 focus:ring-[#b3e6fa] focus:ring-offset-2 hover:bg-[#0090c0] transition-colors duration-200"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanjiQuizFilterModal;

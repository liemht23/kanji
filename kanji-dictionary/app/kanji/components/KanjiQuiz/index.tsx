import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { ChevronRight, CircleCheck, Lightbulb, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { setCurrentQuiz } from "@/store/slices/kanji-collection";
import Correct from "@/components/common/Correct";
import Incorrect from "@/components/common/Incorrect";

const KanjiQuiz = () => {
  const dispatch = useAppDispatch();

  // Local UI states
  const [input, setInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showCorrectAnim, setShowCorrectAnim] = useState(false);
  const [showIncorrectAnim, setShowIncorrectAnim] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  // Track total correct/incorrect answers
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);

  // Redux data
  const { listCurrentQuiz, currentQuiz, timePerQuestion, numQuestions } =
    useAppSelector((state: RootState) => state.kanji);

  // Find index of current quiz, default to 0 if not found
  const currentQuizIndex = currentQuiz
    ? listCurrentQuiz.findIndex(
        (quiz) => quiz.quizIndex === currentQuiz.quizIndex
      )
    : 0;

  // If currentQuiz is not in listCurrentQuiz, automatically switch to the first quiz
  useEffect(() => {
    if (
      currentQuiz &&
      listCurrentQuiz.length > 0 &&
      !listCurrentQuiz.some((quiz) => quiz.id === currentQuiz.id)
    ) {
      dispatch(setCurrentQuiz(listCurrentQuiz[0]));
    }
  }, [currentQuiz, listCurrentQuiz, dispatch]);
  // Timer references
  const totalTime = timePerQuestion;
  const startTime = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isTimerActiveRef = useRef<boolean>(false); // controls whether timer should tick

  // Derive correct answer from current quiz
  const pronun = currentQuiz?.word_parts
    .map((p) => (p.pronun && p.pronun.trim() !== "" ? p.pronun : p.word))
    .join("");

  // Correct answer animation timeout
  const correctAnimTimeout = useRef<NodeJS.Timeout | null>(null);

  // Effect: reset states and start timer when quiz changes
  useEffect(() => {
    let cancelled = false;

    // Reset core UI state asynchronously to avoid "set-state-in-effect" lint warning
    Promise.resolve().then(() => {
      if (cancelled) return;
      setShowAnswer(false);
      setShowMeaning(false);
      setShowCorrectAnim(false);
      setIsCorrect(null);
      setInput("");
      setTimeLeft(totalTime);
    });

    // Start timer for new quiz
    isTimerActiveRef.current = true;
    startTime.current = performance.now();

    const tick = () => {
      // Stop ticking if timer is inactive or effect has been cleaned up
      if (!isTimerActiveRef.current || cancelled) return;

      const elapsed = (performance.now() - startTime.current) / 1000;
      const remaining = totalTime - elapsed;

      // Time is up
      if (remaining <= 0) {
        isTimerActiveRef.current = false;
        setTimeLeft(0);
        // Show hint (meaning) and final answer when time is up
        setShowMeaning(true);
        setIsCorrect(false); // treat as incorrect if user did not answer in time
        setTotalIncorrect((prev) => prev + 1);
        setShowAnswer(true);
        return;
      }

      // Show meaning automatically when half the time has passed
      if (remaining <= totalTime / 2) {
        setShowMeaning(true);
      }

      // Update timer display (with a small precision)
      const rounded = parseFloat(remaining.toFixed(1));
      setTimeLeft((prev) => (prev !== rounded ? rounded : prev));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Cleanup when quiz changes or component unmounts
    return () => {
      cancelled = true;
      isTimerActiveRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentQuiz, totalTime]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // IME composition handlers (for Japanese input)
  const handleCompositionStart = () => setIsComposing(true);

  const handleCompositionEnd = () => {
    // Delay to ensure IME commit completes before any Enter key logic
    setTimeout(() => setIsComposing(false), 0);
  };

  // Handle Enter key -> user submits answer
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();

      if (!showAnswer && !isComposing) {
        const value = input.trim();

        // Stop timer when user answers
        isTimerActiveRef.current = false;

        // Correct answer
        if (pronun && value === pronun) {
          setIsCorrect(true);
          setShowCorrectAnim(true);
          setTotalCorrect((prev) => prev + 1);

          if (correctAnimTimeout.current) {
            clearTimeout(correctAnimTimeout.current);
          }

          // After short animation, show final answer panel
          correctAnimTimeout.current = setTimeout(() => {
            setShowCorrectAnim(false);
            setShowAnswer(true);
          }, 1500);
        } else {
          // Incorrect answer
          setIsCorrect(false);
          setShowIncorrectAnim(true);
          setTotalIncorrect((prev) => prev + 1);

          setTimeout(() => {
            setShowIncorrectAnim(false);
            setShowAnswer(true);
          }, 1500);
        }
      }
    }
  };

  const handleNext = () => {
    setInput("");

    if (
      currentQuizIndex >= 0 &&
      currentQuizIndex + 1 < listCurrentQuiz.length
    ) {
      dispatch(setCurrentQuiz(listCurrentQuiz[currentQuizIndex + 1]));
    }
  };

  // Global key listener for Enter when answer is shown
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showAnswer) {
        // Go to next quiz
        if (currentQuizIndex + 1 < listCurrentQuiz.length) {
          dispatch(setCurrentQuiz(listCurrentQuiz[currentQuizIndex + 1]));
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKey);

    return () => {
      window.removeEventListener("keydown", handleGlobalKey);
    };
  }, [showAnswer, currentQuiz, listCurrentQuiz, dispatch, currentQuizIndex]);

  // Cleanup correct animation timeout on unmount
  useEffect(() => {
    return () => {
      if (correctAnimTimeout.current) {
        clearTimeout(correctAnimTimeout.current);
      }
    };
  }, []);

  return (
    <div className="bg-black-0 border border-black-100 rounded-3xl shadow-lg max-w-3xl mx-auto mt-16 relative overflow-hidden">
      {/* Title & Timer */}
      <div className="flex justify-between items-center mb-6 pt-8 px-8">
        <span className="text-xl font-extrabold tracking-wide text-blue-700">
          Question {currentQuizIndex + 1}/{numQuestions}
        </span>

        {/* Hide timer when the answer is revealed, show stats instead */}
        {!showAnswer ? (
          <span className="text-md font-medium text-gray-500">
            Time left:{" "}
            <span className={timeLeft > 5 ? "text-green-600" : "text-red-500"}>
              {timeLeft.toFixed(1)}
            </span>
          </span>
        ) : (
          <span className="text-md font-medium text-gray-700 flex gap-6">
            <div className="flex items-center gap-2 text-green-600">
              <CircleCheck className="w-6 h-6" />
              <span className="font-bold text-2xl">{totalCorrect}</span>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="w-6 h-6" />
              <span className="font-bold text-2xl">{totalIncorrect}</span>
            </div>
          </span>
        )}
      </div>

      {/* Main Section */}
      <div className="flex flex-row items-stretch justify-center min-h-[340px] relative">
        <div className="flex flex-col items-center justify-center flex-1">
          {/* Kanji display */}
          <div className="kanji-wrapper bg-white border border-blue-100 shadow-md rounded-3xl px-12 py-8 my-8">
            <span className="text-7xl font-black text-blue-900 drop-shadow-lg">
              {currentQuiz?.vocab}
            </span>

            {/* Correct answer animation (overlay) */}
            {showCorrectAnim && (
              <div className="absolute right-0 top-[28%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <Correct />
              </div>
            )}

            {/* Incorrect answer animation (overlay) */}
            {showIncorrectAnim && (
              <div className="absolute right-0 top-[28%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <Incorrect />
              </div>
            )}
          </div>

          {/* Meaning hint */}
          {showMeaning && !showAnswer && (
            <div className="mt-6 px-6 py-4 border-2 rounded-xl border-yellow-400 bg-yellow-50 text-yellow-700 shadow text-lg">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <div className="font-semibold flex items-center">
                  <Lightbulb className="w-4 h-4" />
                  <span className="ml-2">Meaning:</span>
                </div>
                <div className="italic text-gray-700">
                  {currentQuiz?.meaning}
                </div>
              </div>
            </div>
          )}

          {/* Input area (hidden after answer is shown) */}
          {!showAnswer && (
            <div className="mt-6 pb-26 relative">
              <input
                className="border border-blue-200 rounded-xl px-6 py-3 text-2xl text-center 
                focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all shadow-sm mb-2 w-full max-w-md bg-white"
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Enter the answer..."
                autoFocus
              />
            </div>
          )}

          {/* Final answer panel */}
          {showAnswer && (
            <div
              className={`mt-6 px-6 py-4 border-2 rounded-xl shadow text-lg ${
                isCorrect
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-red-400 bg-red-50 text-red-700"
              }`}
            >
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <div className="font-semibold">Your answer:</div>
                <div className="font-bold text-blue-900">{input.trim()}</div>

                <div className="font-semibold">Answer:</div>
                <div className="font-bold text-blue-900">{pronun}</div>

                <div className="font-semibold">Meaning:</div>
                <div className="italic text-gray-700">
                  {currentQuiz?.meaning}
                </div>
              </div>
            </div>
          )}

          {/* NEXT button */}
          {showAnswer && (
            <div
              className="w-full flex items-center justify-center mt-8 p-4 gap-4
              text-blue-700 font-bold hover:text-white hover:bg-blue-700 cursor-pointer"
              onClick={handleNext}
            >
              <span className="text-2xl">NEXT</span>
              <ChevronRight className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar timer */}
      {!showAnswer && (
        <div className="kanji-quiz-progress">
          <div
            className="kanji-quiz-progress-bar"
            style={{
              width: `${(timeLeft / totalTime) * 100}%`,
              background: timeLeft > 5 ? "#22c55e" : "#ef4444",
              transition: "width 0.1s linear, background 0.2s linear",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default KanjiQuiz;

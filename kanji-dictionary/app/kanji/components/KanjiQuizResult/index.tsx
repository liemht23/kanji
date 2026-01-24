import React from "react";
import { CircleCheck, XCircle } from "lucide-react";

interface IncorrectAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  meaning: string;
}

interface KanjiQuizResultProps {
  totalCorrect: number;
  totalIncorrect: number;
  incorrectAnswers: IncorrectAnswer[];
  onRedoQuiz?: () => void;
}

const KanjiQuizResult: React.FC<KanjiQuizResultProps> = ({
  totalCorrect,
  totalIncorrect,
  incorrectAnswers,
  onRedoQuiz,
}) => {
  const handleRedoQuiz = () => {
    if (onRedoQuiz) {
      onRedoQuiz();
    }
  };
  return (
    <div className="bg-black-0 border border-black-100 rounded-3xl shadow-lg max-w-3xl mx-auto mt-16 relative overflow-hidden p-8">
      <div className="mb-2 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Quiz Summary</h2>
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2 text-green-600">
            <CircleCheck className="w-6 h-6" />
            <span className="font-bold text-2xl">{totalCorrect}</span>
            <span className="text-lg">Correct</span>
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-6 h-6" />
            <span className="font-bold text-2xl">{totalIncorrect}</span>
            <span className="text-lg">Incorrect</span>
          </div>
        </div>
      </div>

      {incorrectAnswers.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-red-600">
              # Incorrect Answers
            </h3>
            {onRedoQuiz && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                onClick={handleRedoQuiz}
              >
                Redo Quiz
              </button>
            )}
          </div>
          <div className="max-h-[316px] overflow-y-auto rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                <tr className="h-16">
                  <th className="p-3 text-center border border-gray-300 w-1/10">
                    No.
                  </th>
                  <th className="p-3 text-center border border-gray-300 w-1/5">
                    Question
                  </th>
                  <th className="p-3 text-center border border-gray-300 w-1/5">
                    Your Answer
                  </th>
                  <th className="p-3 text-center border border-gray-300 w-1/5">
                    Correct Answer
                  </th>
                  <th className="p-3 text-center border border-gray-300 w-2/5">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody>
                {incorrectAnswers.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 transition-colors duration-200 h-16 text-center"
                  >
                    <td className="p-3 border border-gray-300">{idx + 1}</td>
                    <td className="p-3 border border-gray-300 font-bold text-blue-900">
                      {item.question}
                    </td>
                    <td className="p-3 border border-gray-300 text-red-600">
                      {item.userAnswer}
                    </td>
                    <td className="p-3 border border-gray-300 text-green-700">
                      {item.correctAnswer}
                    </td>
                    <td className="p-3 border border-gray-300 italic text-gray-700">
                      {item.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-green-700 font-semibold text-lg">
          All answers correct! 🎉
        </div>
      )}
    </div>
  );
};

export default KanjiQuizResult;

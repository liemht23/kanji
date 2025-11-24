import { READING_TYPE } from "@/enum/common-enum";
import { cn } from "@/utils/class-name";
import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";

const VocabCard = () => {
  const dispatch = useAppDispatch();
  const { selectedVocab, loading } = useAppSelector(
    (state: RootState) => state.vocab
  );
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-4xl h-[80vh] mx-auto flex items-center justify-center select-none">
      <div
        className={`w-full h-full transition-transform duration-500 [perspective:1200px]`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={cn(
            `absolute w-full h-full rounded-2xl shadow-lg border border-black-100 bg-white 
            flex flex-col items-stretch transition-transform duration-500 [transform-style:preserve-3d]`,
            flipped ? "[transform:rotateY(180deg)]" : ""
          )}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full flex rounded-2xl [backface-visibility:hidden]">
            {/* Left half */}
            <div className="w-1/2 flex flex-col justify-between p-6 gap-4">
              {/* Title */}
              <div className="flex items-center gap-1 text-lg font-bold pl-10 py-5">
                <div className="bg-orange-400 text-black-0 px-2 py-1 rounded-sm">
                  N5
                </div>
                <div className="text-2xl">第一課</div>
              </div>
              {/* Main Content */}
              <div className="flex flex-col items-center gap-10">
                <div className="flex flex-col items-start gap-2">
                  {/* Vocab */}
                  <div className="text-wrapper cursor-pointer">
                    <div className="flex items-end">
                      {selectedVocab?.word.word_parts.map((part, index) => (
                        <div key={index} className="character-wrapper py-1">
                          <p
                            className={cn(
                              "text-md hiragana text-center",
                              part.reading_type === READING_TYPE.ON
                                ? "text-blue-300"
                                : part.reading_type === READING_TYPE.KUN
                                ? "text-red-500"
                                : part.reading_type === READING_TYPE.SPECIAL
                                ? "text-purple-400"
                                : ""
                            )}
                          >
                            {part.pronun}
                          </p>
                          <p
                            className={cn(
                              "text-5xl font-bold text-center",
                              part.reading_type === READING_TYPE.ON
                                ? "text-blue-300"
                                : part.reading_type === READING_TYPE.KUN
                                ? "text-red-500"
                                : part.reading_type === READING_TYPE.SPECIAL
                                ? "text-purple-400"
                                : ""
                            )}
                          >
                            {part.word}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kanji */}
                  <div className="text-2xl text-gray-700 italic ">
                    {selectedVocab?.word.word_parts
                      .map((part) => part.chinese_character)
                      .filter((char) => !!char)
                      .map((char) => `[${char}]`)
                      .join("、")}
                  </div>
                </div>

                {/* Example */}
                <div className="w-full pl-16 py-5">
                  <div className="text-lg text-gray-800 italic border-l-4 border-blue-300 pl-3">
                    {selectedVocab?.example_sentences.map((sentence, idx) => (
                      <div key={idx}>{sentence.jp}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8"></div>
            </div>

            {/* Right half */}
            <div className="w-1/2 flex items-center justify-center m-20 relative">
              {selectedVocab?.image && (
                <Image
                  src={selectedVocab?.image}
                  alt={selectedVocab?.word.word_parts[0].word}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  draggable={false}
                />
              )}
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              Nhấn để lật thẻ
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-between rounded-2xl gap-10
          [transform:rotateY(180deg)] [backface-visibility:hidden] p-8"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold text-green-700 mb-4 text-center">
                {selectedVocab?.word.meaning}
              </div>
              <div className="text-lg text-gray-800 italic border-l-4 border-blue-300 pl-3">
                {selectedVocab?.example_sentences.map((sentence, idx) => (
                  <div key={idx}>{sentence.vi}</div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              Nhấn để lật thẻ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabCard;

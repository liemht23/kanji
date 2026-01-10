import { SquarePlayIcon, ImageIcon, Book, BookCheck } from "lucide-react";
import Image from "next/image";
import "./index.css";
import Tooltip from "@/components/common/Tooltip";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Spinner from "@/components/common/Spinner";
import { READING_TYPE } from "@/enum/common-enum";
import { SAMPLE_KANJI_BATCH_SIZE } from "@/constants/kanji-const";
import KanjiAnimate from "../KanjiAnimate";
import ExampleImagePopup from "../ExampleImageModal";
import {
  addMemorizedKanji,
  removeMemorizedKanji,
} from "@/store/slices/kanji-collection";

const KanjiCard = () => {
  const dispatch = useAppDispatch();
  const [showKanjiAnimation, setShowKanjiAnimation] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const { selectedKanji, listMemorizedKanji, loading } = useAppSelector(
    (state: RootState) => state.kanji
  );
  const isMemorized = useMemo(() => {
    if (!selectedKanji) return false;
    return listMemorizedKanji?.includes(selectedKanji.id || "") ? true : false;
  }, [listMemorizedKanji, selectedKanji]);

  const exampleBatches = useMemo(() => {
    const examples = selectedKanji?.example ?? [];
    const chunks = [];
    for (let i = 0; i < examples.length; i += SAMPLE_KANJI_BATCH_SIZE) {
      chunks.push(examples.slice(i, i + SAMPLE_KANJI_BATCH_SIZE));
    }
    return chunks;
  }, [selectedKanji]);

  const hasExampleImages =
    selectedKanji?.example_images !== undefined &&
    selectedKanji?.example_images !== null &&
    selectedKanji?.example_images.length > 0
      ? true
      : false;

  const handleMemorizedKanji = () => {
    if (!selectedKanji) return;
    const isAlreadyMemorized = listMemorizedKanji?.includes(
      selectedKanji.id || ""
    );
    if (isAlreadyMemorized) {
      // Remove from memorized
      dispatch(removeMemorizedKanji(selectedKanji.id || ""));
    } else {
      // Add to memorized
      dispatch(addMemorizedKanji(selectedKanji.id || ""));
    }
  };

  useEffect(() => {
    startTransition(() => {
      setIsImgLoading(true);
      setShowKanjiAnimation(false);
    });
  }, [selectedKanji, selectedKanji?.img_url]);

  return (
    <div className="bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm h-[80vh]">
      {loading || !selectedKanji ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center gap-1 text-lg font-bold pl-10 py-5">
            <div className="bg-orange-400 text-black-0 px-2 py-1 rounded-sm">
              N5
            </div>
            <div className="text-2xl">漢字{selectedKanji?.kanji_id}</div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-5 px-20">
              <div className="kanji-wrapper bg-black-100 rounded-2xl px-8 py-4">
                <div className="card-action flex items-center justify-end gap-2 p-2">
                  {selectedKanji?.img_url && (
                    <Tooltip text={showKanjiAnimation ? "Stop" : "Animate"}>
                      <SquarePlayIcon
                        className={cn(
                          "w-6 h-6 cursor-pointer transition-colors",
                          showKanjiAnimation
                            ? "text-blue-300"
                            : "text-black-300 hover:text-black-900"
                        )}
                        onClick={() => {
                          const isActive = !showKanjiAnimation;
                          setShowKanjiAnimation(isActive);
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip text={isMemorized ? "Not memorized" : "Memorized"}>
                    {isMemorized ? (
                      <BookCheck
                        className="w-6 h-6 cursor-pointer transition-colors text-green-400 !visible"
                        onClick={handleMemorizedKanji}
                      />
                    ) : (
                      <Book
                        className="w-6 h-6 cursor-pointer transition-colors text-black-300 hover:text-black-90"
                        onClick={handleMemorizedKanji}
                      />
                    )}
                  </Tooltip>
                  <div
                    className={cn(
                      "flex m-0 p-0",
                      hasExampleImages ? "" : "hidden"
                    )}
                  >
                    <Tooltip text="Show example Images">
                      <ImageIcon
                        className="w-6 h-6 cursor-pointer transition-colors text-black-300 hover:text-black-900"
                        onClick={() => setShowImagePopup(true)}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="relative w-full h-84">
                  {showKanjiAnimation ? (
                    <KanjiAnimate
                      key={selectedKanji?.img_url}
                      kanjiSvgUrl={selectedKanji?.img_url}
                      isActive={showKanjiAnimation}
                      onFinish={() =>
                        setShowKanjiAnimation(!showKanjiAnimation)
                      }
                    />
                  ) : (
                    <>
                      {!showKanjiAnimation && selectedKanji?.img_url ? (
                        <>
                          {isImgLoading && <Spinner />}
                          <Image
                            key={selectedKanji?.img_url}
                            src={selectedKanji?.img_url}
                            alt={selectedKanji?.character}
                            fill
                            className={cn(
                              "object-contain transition-opacity duration-500",
                              isImgLoading ? "opacity-0" : "opacity-100"
                            )}
                            onLoad={() => {
                              if (showKanjiAnimation) return;
                              setIsImgLoading(false);
                            }}
                          />
                        </>
                      ) : (
                        !showKanjiAnimation &&
                        !selectedKanji?.img_url && (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400">
                              No kanji image found
                            </span>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="text-4xl font-bold p-4 text-center">
                <p>{selectedKanji?.chinese_character}</p>
                {selectedKanji?.meaning && (
                  <Tooltip position="right" text={selectedKanji?.meaning}>
                    <p className="text-3xl font-medium py-1 truncate max-w-[300px] mx-auto">
                      {selectedKanji?.meaning}
                    </p>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="col-span-7">
              <div className="text-5xl font-bold">
                <p className="py-2">
                  音読み:
                  <span className="text-4xl text-red-500 pl-10">
                    {selectedKanji?.on_reading}
                  </span>
                </p>
                <p className="py-2">
                  訓読み:
                  <span className="text-4xl text-blue-300 pl-10">
                    {selectedKanji?.kun_reading}
                  </span>
                </p>
              </div>

              <div className="py-4 flex items-start justify-between">
                {exampleBatches.length > 0 &&
                  exampleBatches.map((batch, batchIndex) => (
                    <div key={batchIndex} className="w-1/2">
                      {batch.map((item, index) => (
                        <div
                          key={index}
                          className="text-wrapper cursor-pointer"
                        >
                          {item.meaning && item.meaning !== "" ? (
                            <Tooltip text={item.meaning} position="bottom">
                              <div className="flex items-end">
                                {item.word_parts?.map((part, index) => (
                                  <div
                                    key={index}
                                    className="character-wrapper py-1"
                                  >
                                    <p
                                      className={cn(
                                        "text-md hiragana text-center",
                                        part.reading_type === READING_TYPE.ON
                                          ? "text-red-500"
                                          : part.reading_type ===
                                            READING_TYPE.KUN
                                          ? "text-blue-300"
                                          : part.reading_type ===
                                            READING_TYPE.SPECIAL
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
                                          ? "text-red-500"
                                          : part.reading_type ===
                                            READING_TYPE.KUN
                                          ? "text-blue-300"
                                          : part.reading_type ===
                                            READING_TYPE.SPECIAL
                                          ? "text-purple-400"
                                          : ""
                                      )}
                                    >
                                      {part.word}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="flex items-end">
                              {item.word_parts.map((part, index) => (
                                <div
                                  key={index}
                                  className="character-wrapper py-1"
                                >
                                  <p
                                    className={cn(
                                      "text-md hiragana text-center",
                                      part.reading_type === READING_TYPE.ON
                                        ? "text-red-500"
                                        : part.reading_type === READING_TYPE.KUN
                                        ? "text-blue-300"
                                        : part.reading_type ===
                                          READING_TYPE.SPECIAL
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
                                        ? "text-red-500"
                                        : part.reading_type === READING_TYPE.KUN
                                        ? "text-blue-300"
                                        : part.reading_type ===
                                          READING_TYPE.SPECIAL
                                        ? "text-purple-400"
                                        : ""
                                    )}
                                  >
                                    {part.word}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {showImagePopup && (
            <ExampleImagePopup
              images={selectedKanji?.example_images}
              onClose={() => setShowImagePopup(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KanjiCard;

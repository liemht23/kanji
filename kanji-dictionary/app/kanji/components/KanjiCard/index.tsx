import { BookmarkIcon, SquarePlayIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import "./kanji-card.css";
import Tooltip from "@/components/common/Tooltip";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import { useEffect, useMemo, useState } from "react";
import { getKanjiThunk } from "@/store/slices/kanji-card/thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Spinner from "@/components/common/Spinner";
import { READING_TYPE } from "@/enum/kanji-word";
import { SAMPLE_KANJI_BATCH_SIZE } from "./const";
import KanjiAnimate from "../KanjiAnimate";
import ExampleImagePopup from "../ExampleImageModal";

const KanjiCard = () => {
  const [showKanjiAnimation, setShowKanjiAnimation] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const dispatch = useAppDispatch();
  const { kanjiWord, currentKanjiId, loading } = useAppSelector(
    (state: RootState) => state.kanjiCard
  );

  const exampleBatches = useMemo(() => {
    const examples = kanjiWord?.example ?? [];
    const chunks = [];
    for (let i = 0; i < examples.length; i += SAMPLE_KANJI_BATCH_SIZE) {
      chunks.push(examples.slice(i, i + SAMPLE_KANJI_BATCH_SIZE));
    }
    return chunks;
  }, [kanjiWord]);

  const hasExampleImages =
    kanjiWord?.example_images !== undefined &&
    kanjiWord?.example_images !== null &&
    kanjiWord?.example_images.length > 0
      ? true
      : false;

  useEffect(() => {
    if (typeof currentKanjiId === "number" && !isNaN(currentKanjiId)) {
      dispatch(getKanjiThunk(currentKanjiId)).unwrap();
    }
  }, [dispatch, currentKanjiId]);

  useEffect(() => {
    if (!loading && kanjiWord && showKanjiAnimation) {
      const timeout = setTimeout(() => setShowKanjiAnimation(false), 0);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanjiWord?.kanji_id, loading]);

  return (
    <div className="bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm h-[80vh]">
      {loading || !kanjiWord ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center gap-1 text-lg font-bold pl-10 py-5">
            <div className="bg-orange-400 text-black-0 px-2 py-1 rounded-sm">
              N5
            </div>
            <div className="text-2xl">漢字{kanjiWord?.kanji_id}</div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-5 px-20">
              <div className="kanji-wrapper bg-black-100 rounded-2xl px-8 py-4">
                <div className="card-action flex items-center justify-end gap-2 p-2">
                  <Tooltip text="Save Kanji">
                    <BookmarkIcon className="w-6 h-6 text-black-300 cursor-pointer hover:text-black-900" />
                  </Tooltip>
                  <Tooltip text={showKanjiAnimation ? "Stop" : "Draw Kanji"}>
                    <SquarePlayIcon
                      className={cn(
                        "w-6 h-6 cursor-pointer transition-colors",
                        showKanjiAnimation
                          ? "text-blue-300"
                          : "text-black-300 hover:text-black-900"
                      )}
                      onClick={() => setShowKanjiAnimation((prev) => !prev)}
                    />
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
                      kanjiSvgUrl={kanjiWord?.img_url}
                      onFinish={() => setShowKanjiAnimation(false)}
                    />
                  ) : (
                    <Image
                      src={kanjiWord?.img_url}
                      alt={kanjiWord?.character}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="text-4xl font-bold p-4 text-center">
                <p>{kanjiWord?.chinese_character}</p>
                {kanjiWord?.meaning && (
                  <Tooltip position="right" text={kanjiWord?.meaning}>
                    <p className="text-3xl font-medium py-1 truncate max-w-[300px] mx-auto">
                      {kanjiWord?.meaning}
                    </p>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="col-span-7">
              <div className="text-5xl font-bold">
                <p className="py-2">
                  音読み:
                  <span className="text-4xl text-blue-300 pl-10">
                    {kanjiWord?.on_reading}
                  </span>
                </p>
                <p className="py-2">
                  訓読み:
                  <span className="text-4xl text-red-500 pl-10">
                    {kanjiWord?.kun_reading}
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
                                          ? "text-blue-300"
                                          : part.reading_type ===
                                            READING_TYPE.KUN
                                          ? "text-red-500"
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
                                          ? "text-blue-300"
                                          : part.reading_type ===
                                            READING_TYPE.KUN
                                          ? "text-red-500"
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
                                        ? "text-blue-300"
                                        : part.reading_type === READING_TYPE.KUN
                                        ? "text-red-500"
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
                                        ? "text-blue-300"
                                        : part.reading_type === READING_TYPE.KUN
                                        ? "text-red-500"
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
              images={kanjiWord?.example_images}
              onClose={() => setShowImagePopup(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KanjiCard;

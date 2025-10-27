import { Bookmark, FileDown, SquarePlay } from "lucide-react";
import Image from "next/image";
import "./kanji-card.css";
import Tooltip from "@/components/common/Tooltip";
import { RootState } from "@/store/store";
import { cn } from "@/utils/class-name";
import { useEffect, useMemo } from "react";
import { getKanjiThunk } from "@/store/slices/kanji-word/thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import Spinner from "@/components/common/Spinner";
import { READING_TYPE } from "@/enum/kanji-word";
import { SAMPLE_KANJI_BATCH_SIZE } from "./const";

const KanjiCard = () => {
  const dispatch = useAppDispatch();
  const { kanjiWord, currentKanjiId, loading } = useAppSelector(
    (state: RootState) => state.kanjiWord
  );

  const exampleBatches = useMemo(() => {
    const examples = kanjiWord?.example ?? [];
    const chunks = [];
    for (let i = 0; i < examples.length; i += SAMPLE_KANJI_BATCH_SIZE) {
      chunks.push(examples.slice(i, i + SAMPLE_KANJI_BATCH_SIZE));
    }
    return chunks;
  }, [kanjiWord]);

  useEffect(() => {
    dispatch(getKanjiThunk(currentKanjiId));
  }, [dispatch, currentKanjiId]);

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
                  <Tooltip text="Bookmark">
                    <Bookmark className="w-6 h-6 text-black-300 cursor-pointer hover:text-black-900" />
                  </Tooltip>
                  <Tooltip text="Play">
                    <SquarePlay className="w-6 h-6 text-black-300 cursor-pointer hover:text-black-900" />
                  </Tooltip>
                  <Tooltip text="Download">
                    <FileDown className="w-6 h-6 text-black-300 cursor-pointer hover:text-black-900" />
                  </Tooltip>
                </div>
                <Image
                  src="/kanji/09054.svg"
                  alt="Kanji"
                  width={360}
                  height={360}
                />
              </div>
              <div className="text-5xl font-bold p-4 text-center">
                {kanjiWord?.meaning}
              </div>
            </div>

            <div className="col-span-7">
              <div className="text-4xl font-bold">
                <p className="py-2">
                  音読み:　
                  <span className="text-blue-300">{kanjiWord?.on_reading}</span>
                </p>
                <p className="py-2">
                  訓読み:　
                  <span className="text-red-500">{kanjiWord?.kun_reading}</span>
                </p>
              </div>

              <div className="py-8 flex items-center justify-between">
                {exampleBatches.map((batch, batchIndex) => (
                  <div key={batchIndex} className="w-1/2">
                    {batch.map((item, index) => (
                      <div key={index} className="text-wrapper cursor-pointer">
                        <div className="flex items-end">
                          {item.map((part, index) => (
                            <div key={index} className="character-wrapper">
                              <p
                                className={cn(
                                  "text-sm hiragana",
                                  part.reading_type === READING_TYPE.ON
                                    ? "text-blue-300"
                                    : part.reading_type === READING_TYPE.KUN
                                    ? "text-red-500"
                                    : ""
                                )}
                              >
                                {part.pronun}
                              </p>
                              <p
                                className={cn(
                                  "text-3xl font-bold",
                                  part.reading_type === READING_TYPE.ON
                                    ? "text-blue-300"
                                    : part.reading_type === READING_TYPE.KUN
                                    ? "text-red-500"
                                    : ""
                                )}
                              >
                                {part.word}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KanjiCard;

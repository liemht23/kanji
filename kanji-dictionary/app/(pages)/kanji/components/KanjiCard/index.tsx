import { Bookmark, FileDown, SquarePlay } from "lucide-react";
import Image from "next/image";
import "./kanji-card.css";
import Tooltip from "@/components/common/Tooltip";

const KanjiCard = () => {
  return (
    <div className="bg-black-0 p-4 border border-black-100 rounded-2xl shadow-sm">
      <div className="flex items-center gap-1 text-lg font-bold pl-10 py-5">
        <div className="bg-orange-400 text-black-0 px-2 py-1 rounded-sm">
          N5
        </div>
        <div className="text-2xl">漢字101</div>
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
          <div className="text-5xl font-bold p-4 text-center">ĐẠT</div>
        </div>

        <div className="col-span-7">
          <div className="text-4xl font-bold">
            <p className="py-2">
              音読み:　<span className="text-blue-300">タツ</span>
            </p>
            <p className="py-2">
              訓読み:　<span className="text-red-500">たち</span>
            </p>
          </div>

          <div className="py-8 flex items-center justify-between">

            <div className="w-1/2">
              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm text-red-500 hiragana">たっ</p>
                    <p className="text-3xl font-bold text-red-500">達</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana"></p>
                    <p className="text-3xl font-bold">します</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm text-red-500 hiragana">たっ</p>
                    <p className="text-3xl font-bold text-red-500">達</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">せい</p>
                    <p className="text-3xl font-bold">成</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana"></p>
                    <p className="text-3xl font-bold">します</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm text-red-500 hiragana">たっ</p>
                    <p className="text-3xl font-bold text-red-500">達</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana"></p>
                    <p className="text-3xl font-bold">します</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm text-red-500 hiragana">たっ</p>
                    <p className="text-3xl font-bold text-red-500">達</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">せい</p>
                    <p className="text-3xl font-bold">成</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm hiragana"></p>
                    <p className="text-3xl font-bold">します</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>

              <div className="text-wrapper cursor-pointer">
                <div className="flex items-end">
                  <div className="character-wrapper">
                    <p className="text-sm hiragana">とも</p>
                    <p className="text-3xl font-bold">友</p>
                  </div>
                  <div className="character-wrapper">
                    <p className="text-sm text-blue-300 hiragana">だち</p>
                    <p className="text-3xl font-bold text-blue-300">達</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiCard;

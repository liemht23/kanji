import { READING_TYPE } from "@/enum/kanji-word";

export const mockKanji = {
  kanji_id: 101,
  character: "達",
  img_url: "/kanji/09054.svg",
  on_reading: "タツ",
  kun_reading: "たち",
  chinese_character: "ĐẠT",
  meaning: "",
  example: [
    [
      {
        flg: READING_TYPE.ON,
        word: "達",
        pronun: "だち",
      },
      {
        flg: READING_TYPE.NONE,
        word: "友",
        pronun: "とも",
      },
    ],
    [
      {
        flg: READING_TYPE.KUN,
        word: "達",
        pronun: "たっ",
      },
      {
        flg: READING_TYPE.NONE,
        word: "します",
        pronun: "",
      },
    ],
    [
      {
        flg: READING_TYPE.KUN,
        word: "達",
        pronun: "たっ",
      },
      {
        flg: READING_TYPE.NONE,
        word: "成",
        pronun: "せい",
      },
      {
        flg: READING_TYPE.NONE,
        word: "します",
        pronun: "",
      },
    ],
  ],
  example_images: [],
};

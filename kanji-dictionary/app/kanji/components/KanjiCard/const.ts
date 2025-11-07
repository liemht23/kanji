import { LEVEL } from "@/enum/kanji-word";
import { KanjiData } from "@/types/kanji-word";

export const SAMPLE_KANJI_BATCH_SIZE = 3;
export const LEVEL_OPTION = [
  { value: LEVEL.N1, label: "N1" },
  { value: LEVEL.N2, label: "N2" },
  { value: LEVEL.N3, label: "N3" },
  { value: LEVEL.N4, label: "N4" },
  { value: LEVEL.N5, label: "N5" },
];

export const defaultKanjiData: KanjiData = {
  kanji_id: 0,
  character: "",
  img_url: "/kanji/09054.svg",
  on_reading: "",
  kun_reading: "",
  chinese_character: "",
  meaning: "",
  example: [],
  example_images: [],
};

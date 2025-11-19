import { Vocab } from "@/types/vocab";
import { LEVEL } from "@/enum/common-enum";
import { KanjiData } from "@/types/kanji-word";

export const BUCKET_KANJI_IMAGES = "kanji-images";
export const BUCKET_EXAMPLE_IMAGES = "example-images";
export const BASE_DURATION = 500;
export const DELAY_BETWEEN = 100;
export const SAMPLE_KANJI_BATCH_SIZE = 3;
export const INITIAL_KANJI_ID = 101;
export const INITIAL_MAX_KANJI_ID = 1000;
export const INITIAL_MIN_KANJI_ID = 1;
export const INITIAL_SAMPLE_KANJI_INDEX = 0;
export const INITIAL_SAMPLE_KANJI_LEVEL = LEVEL.N5;

export const DEFAULT_SAMPLE_VOCAB: Vocab = {
  id: INITIAL_SAMPLE_KANJI_INDEX,
  level: INITIAL_SAMPLE_KANJI_LEVEL,
  meaning: "",
  vocab: "",
  word_parts: [],
};

export const DEFAULT_KANJI_DATA: KanjiData = {
  kanji_id: 0,
  character: "",
  img_url: "/kanji/09054.svg",
  on_reading: "",
  kun_reading: "",
  chinese_character: "",
  meaning: "",
  example: [],
  example_images: [],
  is_official: false,
};

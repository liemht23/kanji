import {
  INITIAL_SAMPLE_KANJI_INDEX,
  INITIAL_SAMPLE_KANJI_LEVEL,
} from "@/constants/const";
import { Vocab } from "@/types/vocab";

export const defaultSampleVocab: Vocab = {
  id: INITIAL_SAMPLE_KANJI_INDEX,
  level: INITIAL_SAMPLE_KANJI_LEVEL,
  meaning: "",
  vocab: "",
  word_parts: [],
};

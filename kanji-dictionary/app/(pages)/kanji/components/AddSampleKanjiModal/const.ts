import {
  INITIAL_SAMPLE_KANJI_INDEX,
  INITIAL_SAMPLE_KANJI_LEVEL,
} from "@/constants/const";
import { SampleVocab } from "@/types/sample-vocab";

export const defaultSampleVocab: SampleVocab = {
  id: INITIAL_SAMPLE_KANJI_INDEX,
  level: INITIAL_SAMPLE_KANJI_LEVEL,
  meaning: "",
  vocab: "",
  wordParts: [],
};

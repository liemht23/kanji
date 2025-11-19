import { DEFAULT_SAMPLE_VOCAB } from "@/constants/kanji-const";
import { SampleVocabState } from "@/types/vocab";

export const sampleVocabInitialState: SampleVocabState = {
  currentSampleVocab: DEFAULT_SAMPLE_VOCAB,
  listSampleVocab: [],
};

export default sampleVocabInitialState;

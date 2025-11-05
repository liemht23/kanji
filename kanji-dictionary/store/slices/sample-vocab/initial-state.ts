import { defaultSampleVocab } from "@/app/(pages)/kanji/components/AddSampleKanjiModal/const";
import { SampleVocabState } from "@/types/sample-vocab";

export const sampleVocabInitialState: SampleVocabState = {
  currentSampleVocab: defaultSampleVocab,
  listSampleVocab: [],
};

export default sampleVocabInitialState;

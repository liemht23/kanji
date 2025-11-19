import { LEVEL, READING_TYPE } from "@/enum/common-enum";

export interface WordPart {
  id: number;
  word: string;
  pronun: string;
  reading_type: READING_TYPE;
}

export interface SampleVocab {
  id: number;
  level: LEVEL;
  vocab: string;
  meaning: string;
  word_parts: WordPart[];
}

export interface SampleVocabState {
  currentSampleVocab: SampleVocab;
  listSampleVocab: SampleVocab[];
}

import { LEVEL, READING_TYPE } from "@/enum/kanji-word";

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
  wordParts: WordPart[];
}

export interface SampleVocabState {
  currentSampleVocab: SampleVocab;
  listSampleVocab: SampleVocab[];
}

import { LEVEL, READING_TYPE } from "@/enum/kanji-word";

export interface Vocab {
  id: number;
  level: LEVEL;
  vocab: string;
  meaning: string;
  word_parts: WordPart[];
}

export interface WordPart {
  id: number;
  word: string;
  pronun: string;
  reading_type: READING_TYPE;
}

export interface SampleVocabState {
  currentSampleVocab: Vocab;
  listSampleVocab: Vocab[];
}

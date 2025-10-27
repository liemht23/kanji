import { READING_TYPE } from "@/enum/kanji-word";

export interface WordPart {
  id: number;
  word: string;
  pronun: string;
  reading_type: READING_TYPE;
}

export interface WordPartsState {
  wordParts: WordPart[];
  listWordParts: WordPart[][];
}

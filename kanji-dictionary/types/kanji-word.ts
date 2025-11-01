import { WordPart } from "./word-part";

export interface KanjiData {
  kanji_id: number;
  character: string;
  img_url: string;
  on_reading: string;
  kun_reading: string;
  chinese_character: string;
  meaning: string;
  example: WordPart[][];
  example_images: string[];
}

export interface KanjiState {
  kanjiWord: KanjiData | null;
  loading: boolean;
  currentKanjiId: number;
  maxKanjiId: number;
  minKanjiId: number;
}

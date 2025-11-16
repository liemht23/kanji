import { Vocab } from "./vocab";

export interface KanjiData {
  kanji_id: number;
  character: string;
  img_url: string;
  on_reading: string;
  kun_reading: string;
  chinese_character: string;
  meaning: string;
  example: Vocab[];
  example_images: string[];
  is_official: boolean;
}

export interface KanjiCardState {
  kanjiWord: KanjiData;
  editedKanji: KanjiData | null;
  loading: boolean;
  currentKanjiId: number;
  maxKanjiId: number;
  minKanjiId: number;
}

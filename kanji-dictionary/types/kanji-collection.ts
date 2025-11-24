import { LEVEL } from "@/enum/common-enum";
import { Vocab, WordPart } from "./vocab";
import { Kanji } from "./kanji";

export interface KanjiCollection {
  id: string;
  title: string;
  description: string;
  level: number;
}

export interface SampleVocab {
  id: number;
  level: LEVEL;
  vocab: string;
  meaning: string;
  word_parts: WordPart[];
}

export interface KanjiCollectionState {
  listKanjiCollections: KanjiCollection[];
  selectedCollection: KanjiCollection | null;
  kanjiCards: Kanji[];
  selectedKanji: Kanji | null;
  editedKanji: Kanji | null;
  currentSampleVocab: Vocab;
  listSampleVocab: Vocab[];
  loading: boolean;
}

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

export interface KanjiQuiz extends SampleVocab {
  quizIndex: number;
}

export interface ToolbarState {
  isOpenQuizFilter: boolean;
  isOpenQuiz: boolean;
}

export interface KanjiCollectionState {
  toolbarState: ToolbarState;
  listKanjiCollections: KanjiCollection[];
  selectedCollection: KanjiCollection | null;
  kanjiCards: Kanji[];
  selectedKanji: Kanji | null;
  editedKanji: Kanji | null;
  selectedKanjiRange: Kanji[] | null;
  currentSampleVocab: Vocab;
  listSampleVocab: Vocab[];
  listMemorizedKanji: string[];
  timePerQuestion: number;
  numQuestions: number;
  currentQuiz: KanjiQuiz | null;
  listCurrentQuiz: KanjiQuiz[];
  listAllQuiz: KanjiQuiz[];
  loading: boolean;
}

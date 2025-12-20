import { DEFAULT_SAMPLE_VOCAB } from "@/constants/kanji-const";
import { KanjiCollectionState } from "@/types/kanji-collection";

export const kanjiCollectionInitialState: KanjiCollectionState = {
  toolbarState: {
    isOpenQuizFilter: false,
    isOpenQuiz: false,
  },
  listKanjiCollections: [],
  selectedCollection: null,
  kanjiCards: [],
  selectedKanji: null,
  editedKanji: null,
  currentSampleVocab: DEFAULT_SAMPLE_VOCAB,
  listSampleVocab: [],
  listMemorizedKanji: [],
  timePerQuestion: 30,
  numQuestions: 100,
  currentQuiz: null,
  listCurrentQuiz: [],
  listAllQuiz: [],
  loading: false,
};

export default kanjiCollectionInitialState;

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
  currentQuiz: null,
  listQuiz: [],
  loading: false,
};

export default kanjiCollectionInitialState;

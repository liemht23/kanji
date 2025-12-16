import { DEFAULT_SAMPLE_VOCAB } from "@/constants/kanji-const";
import { KanjiCollectionState } from "@/types/kanji-collection";

export const kanjiCollectionInitialState: KanjiCollectionState = {
  listKanjiCollections: [],
  selectedCollection: null,
  kanjiCards: [],
  selectedKanji: null,
  editedKanji: null,
  currentSampleVocab: DEFAULT_SAMPLE_VOCAB,
  listSampleVocab: [],
  listMemorizedKanji: [],
  loading: false,
};

export default kanjiCollectionInitialState;

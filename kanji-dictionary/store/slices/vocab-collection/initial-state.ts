import { VocabCollectionState } from "@/types/vocab-collection";

export const vocabCollectionInitialState: VocabCollectionState = {
  listVocabCollections: [],
  selectedCollection: null,
  vocabCards: [],
  loading: false,
};

export default vocabCollectionInitialState;

import { Vocab } from "./vocab";

export interface VocabCollection {
  id: string;
  title: string;
  description: string;
  level: string;
}

export interface VocabCard {
  collection_id: string;
  word: Vocab;
  example_sentences: ExampleSentence[];
  image: string;
}

export interface ExampleSentence {
  jp: string;
  vi: string;
}

export interface VocabCollectionState {
  listVocabCollections: VocabCollection[];
  selectedCollection: VocabCollection | null;
  vocabCards: VocabCard[];
  loading: boolean;
}

import { configureStore } from "@reduxjs/toolkit";
import kanjiCardWordReducer from "./slices/kanji-card";
import sampleVocabReducer from "./slices/sample-vocab";
import vocabCollectionReducer from "./slices/vocab-collection";

const makeStore = () => {
  return configureStore({
    reducer: {
      kanjiCard: kanjiCardWordReducer,
      sampleVocab: sampleVocabReducer,
      vocabCollection: vocabCollectionReducer,
    },
  });
};

export default makeStore;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

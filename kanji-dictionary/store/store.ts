import { configureStore } from "@reduxjs/toolkit";
import kanjiCardWordReducer from "./slices/kanji-card";
import sampleVocab from "./slices/sample-vocab";

const makeStore = () => {
  return configureStore({
    reducer: {
      kanjiCard: kanjiCardWordReducer,
      sampleVocab: sampleVocab,
    },
  });
};

export default makeStore;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

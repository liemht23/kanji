import { configureStore } from "@reduxjs/toolkit";
import kanjiWordReducer from "./slices/kanji-word";
import wordPartsReducer from "./slices/word-parts";

const makeStore = () => {
  return configureStore({
    reducer: {
      kanjiWord: kanjiWordReducer,
      wordParts: wordPartsReducer,
    },
  });
};

export default makeStore;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

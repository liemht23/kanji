import { configureStore } from "@reduxjs/toolkit";
import vocabReducer from "./slices/vocab-collection";
import kanjiReducer from "./slices/kanji-collection";

const makeStore = () => {
  return configureStore({
    reducer: {
      kanji: kanjiReducer,
      vocab: vocabReducer,
    },
  });
};

export default makeStore;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

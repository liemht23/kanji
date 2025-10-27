import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import wordPartsInitialState from "./initial-state";

export const wordPartsSlice = createSlice({
  name: "word-parts",
  initialState: wordPartsInitialState,
  reducers: {
    setWordPart: (state, action) => {
      const updated = action.payload;
      const index = state.wordParts.findIndex((wp) => wp.id === updated.id);

      if (index !== -1) {
        state.wordParts[index] = updated;
      } else {
        state.wordParts.push(updated);
      }
    },
    removeWordPart: (state, action: PayloadAction<number>) => {
      const idToRemove = action.payload;

      state.wordParts = state.wordParts.filter((wp) => wp.id !== idToRemove);

      state.wordParts = state.wordParts.map((wp) =>
        wp.id !== null && wp.id > idToRemove ? { ...wp, id: wp.id - 1 } : wp
      );
    },
    clearWordParts: (state) => {
      state.wordParts = [];
    },
    setListWordParts: (state) => {
      state.listWordParts = [...state.listWordParts, state.wordParts];
    },
    clearListWordParts: (state) => {
      state.listWordParts = [];
    },
  },
});

export const {
  setWordPart,
  removeWordPart,
  clearWordParts,
  setListWordParts,
  clearListWordParts,
} = wordPartsSlice.actions;
export default wordPartsSlice.reducer;

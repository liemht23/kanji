import { createSlice } from "@reduxjs/toolkit";
import { getKanjiThunk } from "./thunk";
import kanjiInitialState from "./initial-state";
import { KanjiData } from "@/types/kanji-word";

export const kanjiSlice = createSlice({
  name: "kanji-word",
  initialState: kanjiInitialState,
  reducers: {
    setCurrentKanjiId: (state, action) => {
      state.currentKanjiId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKanjiThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getKanjiThunk.fulfilled, (state, action) => {
        state.kanjiWord = action.payload as KanjiData;
        state.loading = false;
      })
      .addCase(getKanjiThunk.rejected, (state) => {
        state.kanjiWord = null;
        state.loading = false;
      });
  },
});

export const { setCurrentKanjiId } = kanjiSlice.actions;
export default kanjiSlice.reducer;

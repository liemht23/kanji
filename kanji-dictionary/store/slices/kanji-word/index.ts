import { createSlice } from "@reduxjs/toolkit";
import { getKanjiThunk, searchKanjiThunk } from "./thunk";
import kanjiInitialState from "./initial-state";

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
        state.kanjiWord = action.payload.kanjiWord;
        state.maxKanjiId = action.payload.maxKanjiId;
        state.minKanjiId = action.payload.minKanjiId;
        state.currentKanjiId = action.payload.kanjiWord.kanji_id;
        state.loading = false;
      })
      .addCase(getKanjiThunk.rejected, (state) => {
        state.kanjiWord = null;
        state.loading = false;
      })

      .addCase(searchKanjiThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchKanjiThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.kanjiWord = action.payload;
      })
      .addCase(searchKanjiThunk.rejected, (state) => {
        state.loading = false;
        state.kanjiWord = null;
      });
  },
});

export const { setCurrentKanjiId } = kanjiSlice.actions;
export default kanjiSlice.reducer;

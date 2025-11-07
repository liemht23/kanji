import { createSlice } from "@reduxjs/toolkit";
import { getKanjiThunk, searchKanjiThunk } from "./thunk";
import kanjiInitialState from "./initial-state";
import { defaultKanjiData } from "@/app/kanji/components/KanjiCard/const";

export const kanjiCardSlice = createSlice({
  name: "kanji-card",
  initialState: kanjiInitialState,
  reducers: {
    setCurrentKanjiId: (state, action) => {
      state.currentKanjiId = action.payload;
    },
    setEditedKanji(state, action) {
      state.editedKanji = action.payload;
    },
    clearEditedKanji(state) {
      state.editedKanji = null;
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
        state.currentKanjiId = action.payload?.kanjiWord.kanji_id;
        state.loading = false;
      })
      .addCase(getKanjiThunk.rejected, (state) => {
        state.kanjiWord = defaultKanjiData;
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
        state.kanjiWord = defaultKanjiData;
      });
  },
});

export const { setCurrentKanjiId, setEditedKanji, clearEditedKanji } =
  kanjiCardSlice.actions;
export default kanjiCardSlice.reducer;

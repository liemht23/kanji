import { createSlice } from "@reduxjs/toolkit";
import sampleVocabInitialState from "./initial-state";
import { DEFAULT_SAMPLE_VOCAB } from "@/constants/kanji-const";

export const sampleVocabSlice = createSlice({
  name: "sample-vocab",
  initialState: sampleVocabInitialState,
  reducers: {
    setWordPart: (state, action) => {
      const parts = state.currentSampleVocab.word_parts;
      const index = parts.findIndex((wp) => wp.id === action.payload.id);
      if (index >= 0) parts[index] = action.payload;
      else parts.push(action.payload);
    },
    removeWordPart: (state, action) => {
      const idToRemove = action.payload;
      const updatedParts = state.currentSampleVocab.word_parts
        .filter((wp) => wp.id !== idToRemove)
        .map((wp) => (wp.id > idToRemove ? { ...wp, id: wp.id - 1 } : wp));

      state.currentSampleVocab.word_parts = updatedParts;
    },
    setSampleVocab: (state, action) => {
      state.currentSampleVocab = action.payload;
    },
    setLevel: (state, action) => {
      state.currentSampleVocab.level = action.payload;
    },
    setMeaning: (state, action) => {
      state.currentSampleVocab.meaning = action.payload;
    },
    clearSampleVocab: (state) => {
      state.currentSampleVocab = DEFAULT_SAMPLE_VOCAB;
    },
    setListSampleVocal: (state, action) => {
      state.listSampleVocab = action.payload;
    },
    setSampleVocabToList: (state) => {
      const word_parts = state.currentSampleVocab.word_parts;
      const sortedWords = [...word_parts]
        .sort((a, b) => a.id - b.id)
        .map((item) => item.word);
      const vocab = sortedWords.join("");
      // Update vocab
      state.currentSampleVocab.vocab = vocab;

      const sampleVocab = { ...state.currentSampleVocab };

      if (state.listSampleVocab.length == 0) {
        // First time add
        sampleVocab.id = 1;
        state.listSampleVocab.push(sampleVocab);
      } else {
        const index = state.listSampleVocab.findIndex(
          (vc) => vc.id === sampleVocab.id
        );
        // Others
        if (index >= 0) {
          // Update
          state.listSampleVocab[index] = sampleVocab;
        } else {
          // Insert
          const maxId =
            state.listSampleVocab.length > 0
              ? Math.max(...state.listSampleVocab.map((vc) => vc.id))
              : 0;

          sampleVocab.id = maxId + 1;
          state.listSampleVocab.push(sampleVocab);
        }
      }
    },
    removeSampleVocabFromList: (state, action) => {
      const idToRemove = action.payload;

      state.listSampleVocab = state.listSampleVocab
        .filter((vc) => vc.id !== idToRemove)
        .map((vc) => (vc.id > idToRemove ? { ...vc, id: vc.id - 1 } : vc));
    },
    clearListSampleVocab: (state) => {
      state.listSampleVocab = [];
    },
  },
});

export const {
  setWordPart,
  removeWordPart,
  setSampleVocab,
  setLevel,
  setMeaning,
  clearSampleVocab,
  setListSampleVocal,
  setSampleVocabToList,
  removeSampleVocabFromList,
  clearListSampleVocab,
} = sampleVocabSlice.actions;
export default sampleVocabSlice.reducer;

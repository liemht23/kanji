import { createSlice } from "@reduxjs/toolkit";
import kanjiCollectionInitialState from "./inital-state";
import {
  getAllBookmarkedKanjiThunk,
  getAllKanjiCollectionThunk,
  getKanjiByCollectionIdThunk,
  updateIsPublishedThunk,
} from "./thunk";
import { DEFAULT_SAMPLE_VOCAB } from "@/constants/kanji-const";

export const kanjiCollectionSlice = createSlice({
  name: "kanji-collection",
  initialState: kanjiCollectionInitialState,
  reducers: {
    setSelectedKanjiCollection: (state, action) => {
      state.selectedCollection = action.payload;
      if (action.payload === null) {
        state.kanjiCards = [];
      }
    },

    setSelectedKanji: (state, action) => {
      state.selectedKanji = action.payload;
    },
    setEditedKanji: (state, action) => {
      state.editedKanji = action.payload;
    },

    setSampleVocab: (state, action) => {
      state.currentSampleVocab = action.payload;
    },
    clearSampleVocab: (state) => {
      state.currentSampleVocab = DEFAULT_SAMPLE_VOCAB;
    },

    setListSampleVocab: (state, action) => {
      state.listSampleVocab = action.payload;
    },
    clearListSampleVocab: (state) => {
      state.listSampleVocab = [];
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

    setLevel: (state, action) => {
      state.currentSampleVocab.level = action.payload;
    },

    setMeaning: (state, action) => {
      state.currentSampleVocab.meaning = action.payload;
    },

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

    removeBookmarkedKanji: (state, action) => {
      const kanjiIdToRemove = action.payload;
      state.listBookmarkedKanji = state.listBookmarkedKanji.filter(
        (kanjiId) => kanjiId !== kanjiIdToRemove
      );
    },
    addBookmarkedKanji: (state, action) => {
      const kanjiIdToAdd = action.payload;
      if (!state.listBookmarkedKanji.includes(kanjiIdToAdd)) {
        state.listBookmarkedKanji.push(kanjiIdToAdd);
      }
    },

    resetKanjiCollection: () => kanjiCollectionInitialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllKanjiCollectionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllKanjiCollectionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.listKanjiCollections = action.payload;
      })
      .addCase(getAllKanjiCollectionThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getKanjiByCollectionIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getKanjiByCollectionIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.kanjiCards = action.payload;
        state.selectedKanji = state.kanjiCards[0] || null;
      })
      .addCase(getKanjiByCollectionIdThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getAllBookmarkedKanjiThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBookmarkedKanjiThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.listBookmarkedKanji = action.payload;
      })
      .addCase(getAllBookmarkedKanjiThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateIsPublishedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIsPublishedThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (
          state.selectedKanji &&
          state.selectedKanji.id === action.payload?.id
        ) {
          state.selectedKanji.is_published = action.payload?.is_published;
        }
      })
      .addCase(updateIsPublishedThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSelectedKanjiCollection,
  setSelectedKanji,
  setEditedKanji,
  setSampleVocab,
  clearSampleVocab,
  setListSampleVocab,
  clearListSampleVocab,
  setSampleVocabToList,
  removeSampleVocabFromList,
  setLevel,
  setMeaning,
  setWordPart,
  removeWordPart,
  removeBookmarkedKanji,
  addBookmarkedKanji,
  resetKanjiCollection,
} = kanjiCollectionSlice.actions;
export default kanjiCollectionSlice.reducer;

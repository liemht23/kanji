import { createSlice } from "@reduxjs/toolkit";
import vocabCollectionInitialState from "./initial-state";
import {
  getAllVocabCollectionThunk,
  getVocabByCollectionIdThunk,
} from "./thunk";

export const vocabCollectionSlice = createSlice({
  name: "vocab-collection",
  initialState: vocabCollectionInitialState,
  reducers: {
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
      if (action.payload === null) {
        state.vocabCards = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVocabCollectionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVocabCollectionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.listVocabCollections = action.payload;
      })
      .addCase(getAllVocabCollectionThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getVocabByCollectionIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVocabByCollectionIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.vocabCards = action.payload;
      })
      .addCase(getVocabByCollectionIdThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedCollection } = vocabCollectionSlice.actions;
export default vocabCollectionSlice.reducer;

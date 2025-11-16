import {
  getAllVocabCollectionData,
  getVocabByCollectionId,
} from "@/app/vocab/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVocabCollectionThunk = createAsyncThunk(
  "vocabCollection/getAllVocabCollection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllVocabCollectionData();
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const getVocabByCollectionIdThunk = createAsyncThunk(
  "vocabCollection/getVocabByCollectionId",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const response = await getVocabByCollectionId(collectionId);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

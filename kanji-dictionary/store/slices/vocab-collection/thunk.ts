import {
  getAllVocabCollectionData,
  getListVocabByCollectionId,
} from "@/app/vocab/apis";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVocabCollectionThunk = createAsyncThunk(
  "vocab/getAllVocabCollection",
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
  "vocab/getListVocabByCollectionId",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const response = await getListVocabByCollectionId(collectionId);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

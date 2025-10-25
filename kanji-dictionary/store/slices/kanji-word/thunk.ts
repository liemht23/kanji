import { getKanji } from "@/lib/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getKanjiThunk = createAsyncThunk(
  "kanji/getKanji",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getKanji(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

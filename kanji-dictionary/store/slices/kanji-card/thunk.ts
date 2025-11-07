import {
  getKanjiFullData,
  insertKanji,
  searchKanji,
  updateKanji,
} from "@/lib/api";
import { KanjiData } from "@/types/kanji-word";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getKanjiThunk = createAsyncThunk(
  "kanji/getKanji",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getKanjiFullData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const upsertKanjiThunk = createAsyncThunk(
  "kanji/upsertKanji",
  async (
    { data, isEdit }: { data: KanjiData; isEdit: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = isEdit
        ? await updateKanji(data)
        : await insertKanji(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchKanjiThunk = createAsyncThunk(
  "kanji/searchKanji",
  async (character: string, { rejectWithValue }) => {
    try {
      const response: KanjiData = await searchKanji(character);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

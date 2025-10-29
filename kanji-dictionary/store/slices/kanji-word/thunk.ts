import { getKanjiWord, insertKanji } from "@/lib/api";
import { KanjiData } from "@/types/kanji-word";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getKanjiThunk = createAsyncThunk(
  "kanji/getKanji",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getKanjiWord(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const insertKanjiThunk = createAsyncThunk(
  "kanji/insertKanji",
  async (kanjiWord: KanjiData, { rejectWithValue }) => {
    try {
      const response = await insertKanji(kanjiWord);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

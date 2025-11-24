import {
  getAllKanjiCollectionData,
  getListKanjiByCollectionId,
  insertKanji,
  searchKanji,
  updateIsPublished,
  updateKanji,
} from "@/app/kanji/apis";
import { Kanji } from "@/types/kanji";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllKanjiCollectionThunk = createAsyncThunk(
  "kanji/getAllKanjiCollection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllKanjiCollectionData();
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const getKanjiByCollectionIdThunk = createAsyncThunk(
  "kanji/getListKanjiByCollectionId",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const response = await getListKanjiByCollectionId(collectionId);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const upsertKanjiThunk = createAsyncThunk(
  "kanji/upsertKanji",
  async (
    { data, isEdit }: { data: Kanji; isEdit: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = isEdit
        ? await updateKanji(data)
        : await insertKanji(data);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const updateIsPublishedThunk = createAsyncThunk(
  "kanji/updateIsPublished",
  async (
    { id, isPublished }: { id: string; isPublished: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateIsPublished(id, isPublished);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

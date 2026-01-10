import {
  getAllMemorizedKanji,
  getAllKanjiCollectionData,
  getListKanjiByCollectionId,
  insertKanji,
  updateIsPublished,
  updateKanji,
  upsertMemorizedKanji,
  getKanjiImageUrl,
  insertKanjiImage,
  deleteKanji,
} from "@/app/kanji/apis";
import { PROGRESS_TYPE } from "@/enum/progress-enum";
import { supabase } from "@/lib/supabase-client";
import { Kanji } from "@/types/kanji";
import { KanjiImages } from "@/types/kanji-images";
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

export const deleteKanjiThunk = createAsyncThunk(
  "kanji/deleteKanji",
  async (kanji: Kanji, { rejectWithValue }) => {
    try {
      const response = await deleteKanji(kanji.id);
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

export const getAllMemorizedKanjiThunk = createAsyncThunk(
  "kanji/getAllMemorizedKanji",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.id) {
        return [];
      }

      const response = await getAllMemorizedKanji(
        session.user.id,
        collectionId
      );
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const upsertMemorizedKanjiThunk = createAsyncThunk(
  "kanji/upsertMemorizedKanji",
  async (
    {
      userId,
      collectionId,
      kanjiIds,
    }: { userId: string; kanjiIds: string[]; collectionId: string },
    { rejectWithValue }
  ) => {
    try {
      const data = {
        user_id: userId,
        type: PROGRESS_TYPE.KANJI,
        collection_id: collectionId,
        alias_ids: kanjiIds,
      };
      const response = await upsertMemorizedKanji(data);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const getKanjiImageUrlThunk = createAsyncThunk(
  "kanji/getKanjiImageUrl",
  async (kanjiId: string, { rejectWithValue }) => {
    try {
      const response = await getKanjiImageUrl(kanjiId);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

export const insertKanjiImageThunk = createAsyncThunk(
  "kanji/insertKanjiImage",
  async (kanjiImage: KanjiImages, { rejectWithValue }) => {
    try {
      const response = await insertKanjiImage(kanjiImage);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

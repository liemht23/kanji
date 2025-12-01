import {
  getAllBookmarkedKanji,
  getAllKanjiCollectionData,
  getListKanjiByCollectionId,
  insertKanji,
  updateIsPublished,
  updateKanji,
  upsertBookmarkedKanji,
} from "@/app/kanji/apis";
import { BOOKMARK_TYPE } from "@/enum/bookmark-enum";
import { supabase } from "@/lib/supabase-client";
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

export const getAllBookmarkedKanjiThunk = createAsyncThunk(
  "kanji/getAllBookmarkedKanji",
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.id) {
        return [];
      }

      const response = await getAllBookmarkedKanji(
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

export const upsertBookmarkedKanjiThunk = createAsyncThunk(
  "kanji/upsertBookmarkedKanji",
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
        type: BOOKMARK_TYPE.KANJI,
        collection_id: collectionId,
        alias_ids: kanjiIds,
      };
      const response = await upsertBookmarkedKanji(data);
      return response;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      return rejectWithValue(msg);
    }
  }
);

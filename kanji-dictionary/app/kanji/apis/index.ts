import axiosClient from "@/lib/axios-client";
import { supabase } from "@/lib/supabase-client";
import { INITIAL_KANJI_ID } from "@/constants/kanji-const";
import { Kanji } from "@/types/kanji";

export const getAllKanjiCollectionData = async () => {
  const { data, error } = await supabase.from("kanji_collection").select("*");

  if (error) throw error;
  return data;
};

export const getListKanjiByCollectionId = async (collectionId: string) => {
  const { data, error } = await supabase
    .from("kanji")
    .select("*")
    .eq("collection_id", collectionId)
    .order("kanji_id", { ascending: true });

  if (error) throw error;
  return data;
};

export const getKanji = async (id: string) => {
  try {
    const response = await axiosClient.get(`/kanji/${id}`);
    return response;
  } catch (error) {
    console.error("Get kanji error:", error);
    throw error;
  }
};

export const getKanjiFullData = async (id: number) => {
  const [kanjiRes, maxRes, minRes] = await Promise.all([
    supabase.from("kanji").select("*").eq("kanji_id", id).limit(1).single(),
    supabase
      .from("kanji")
      .select("kanji_id")
      .order("kanji_id", { ascending: false })
      .limit(1),
    supabase
      .from("kanji")
      .select("kanji_id")
      .order("kanji_id", { ascending: true })
      .limit(1),
  ]);

  if (kanjiRes.error) throw kanjiRes.error;
  if (maxRes.error) throw maxRes.error;
  if (minRes.error) throw minRes.error;

  return {
    kanjiWord: kanjiRes.data,
    maxKanjiId: maxRes.data?.[0]?.kanji_id ?? INITIAL_KANJI_ID,
    minKanjiId: minRes.data?.[0]?.kanji_id ?? INITIAL_KANJI_ID,
  };
};

export const insertKanji = async (kanjiWord: Kanji) => {
  const { data, error } = await supabase.from("kanji").insert(kanjiWord);

  if (error) throw error;
  return data;
};

export const updateKanji = async (kanjiWord: Kanji) => {
  if (!kanjiWord.id) {
    throw new Error("Missing id for update");
  }

  const { id, ...updateFields } = kanjiWord;

  const { data, error } = await supabase
    .from("kanji")
    .update(updateFields)
    .eq("id", id);

  if (error) throw error;
  return data;
};

export const searchKanji = async (character: string) => {
  const { data, error } = await supabase
    .from("kanji")
    .select("*")
    .eq("character", character)
    .single();

  if (error) throw error;
  return data;
};

export const updateIsPublished = async (id: string, isPublished: boolean) => {
  const { data, error } = await supabase
    .from("kanji")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return data;
};

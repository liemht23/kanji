import { KanjiData } from "@/types/kanji-word";
import { supabase } from "./supabase-client";
import { INITIAL_KANJI_ID } from "@/constants/const";

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

export const insertKanji = async (kanjiWord: KanjiData) => {
  const { data, error } = await supabase.from("kanji").insert(kanjiWord);

  if (error) throw error;
  return data;
};

export const updateKanji = async (kanjiWord: KanjiData) => {
  if (!kanjiWord.kanji_id) {
    throw new Error("Missing kanji_id for update");
  }

  const { kanji_id, ...updateFields } = kanjiWord;

  const { data, error } = await supabase
    .from("kanji")
    .update(updateFields)
    .eq("kanji_id", kanji_id);

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

export const updateIsOfficial = async (
  kanjiId: number,
  isOfficial: boolean
) => {
  const { data, error } = await supabase
    .from("kanji")
    .update({ is_official: isOfficial })
    .eq("kanji_id", kanjiId)
    .select("*")
    .single();

  if (error) throw error;

  return data;
};

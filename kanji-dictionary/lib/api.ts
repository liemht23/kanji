import { KanjiData } from "@/types/kanji-word";
import { supabase } from "./supabase-client";

export const getKanjiWord = async (id: number) => {
  try {
    const [kanjiWord, maxKanjiId, minKanjiId] = await Promise.all([
      getKanjiData(id),
      getMaxKanjiId(),
      getMinKanjiId()
    ])

    return { kanjiWord, maxKanjiId, minKanjiId };
  } catch (error) {
    throw error;
  }
};

export const getKanjiData = async (id: number) => {
  const { data, error } = await supabase
    .from("kanji")
    .select("*")
    .eq("kanji_id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getMaxKanjiId = async () => {
  const { data, error } = await supabase
    .from("kanji")
    .select("kanji_id")
    .order("kanji_id", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0]?.kanji_id ?? null;
};

export const getMinKanjiId = async () => {
  const { data, error } = await supabase
    .from("kanji")
    .select("kanji_id")
    .order("kanji_id", { ascending: true })
    .limit(1);

  if (error) throw error;
  return data?.[0]?.kanji_id ?? null;
};

export const insertKanji = async (kanjiWord: KanjiData) => {
  const { data, error } = await supabase.from("kanji").insert(kanjiWord);

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


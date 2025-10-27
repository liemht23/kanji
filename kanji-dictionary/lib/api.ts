import { KanjiData } from "@/types/kanji-word";
import { supabase } from "./supabase-client";

export const getKanji = async (id: number) => {
  const { data, error } = await supabase
    .from("kanji")
    .select("*")
    .eq("kanji_id", id)
    .single();

  if (error) throw error;
  return data;
};

export const insertKanji = async (kanjiWord: KanjiData) => {
  const { data, error } = await supabase.from("kanji").insert(kanjiWord);

  if (error) throw error;
  return data;
};

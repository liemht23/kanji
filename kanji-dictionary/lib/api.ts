import { supabase } from "./supabase-client";

export const getKanji = async (id: string) => {
  const { data, error } = await supabase
    .from("kanji")
    .select("*")
    .eq("no", id)
    .single();

  if (error) throw error;
  return data;
};

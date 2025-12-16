import { PROGRESS_TYPE } from "@/enum/progress-enum";
import { supabase } from "@/lib/supabase-client";
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

export const updateIsPublished = async (id: string, isPublished: boolean) => {
  const { data, error } = await supabase
    .from("kanji")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const getAllMemorizedKanji = async (
  userId: string,
  collectionId: string
) => {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("type", PROGRESS_TYPE.KANJI)
    .eq("collection_id", collectionId)
    .maybeSingle();

  if (error) throw error;
  return data?.alias_ids || [];
};

export const upsertMemorizedKanji = async (data: {
  user_id: string;
  type: PROGRESS_TYPE;
  collection_id: string;
  alias_ids: string[];
}) => {
  const { data: responseData, error } = await supabase
    .from("progress")
    .upsert(data)
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return responseData;
};

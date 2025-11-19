import { supabase } from "@/lib/supabase-client";

export const getAllVocabCollectionData = async () => {
  const { data, error } = await supabase.from("vocab_collection").select("*");

  if (error) throw error;
  return data;
};

export const getListVocabByCollectionId = async (collectionId: string) => {
  const { data, error } = await supabase
    .from("vocab")
    .select("*")
    .eq("collection_id", collectionId);

  if (error) throw error;
  return data;
};

import { supabase } from "./supabase-client";

export const uploadImage = async (file: File) => {
  const bucket = "kanji-images";
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

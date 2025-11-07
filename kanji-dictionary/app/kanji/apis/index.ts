import axiosClient from "@/lib/axios-client";

export const getKanji = async (id: string) => {
  try {
    const response = await axiosClient.get(`/kanji/${id}`);
    return response;
  } catch (error) {
    console.error("Get kanji error:", error);
    throw error;
  }
};

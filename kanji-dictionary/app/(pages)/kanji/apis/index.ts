import { mockKanji } from "./mock";
import axiosClient from "@/lib/axios-client";

export const getKanji = async (id: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (process.env.NEXT_PUBLIC_IS_MOCK_API === "1") {
      return mockKanji;
    }
    const response = await axiosClient.get(`/kanji/${id}`);
    return response;
  } catch (error) {
    console.error("Get kanji error:", error);
    throw error;
  }
};

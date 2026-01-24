import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";

export function useKanjiFormState(isOpen: boolean) {
  const { editedKanji, kanjiCards } = useAppSelector(
    (state: RootState) => state.kanji,
  );
  const isEditMode = Boolean(editedKanji);

  // ------- Form Fields (controlled) -------
  const [kanjiId, setKanjiId] = useState<number | "">("");
  const [character, setCharacter] = useState("");
  const [onReading, setOnReading] = useState("");
  const [kunReading, setKunReading] = useState("");
  const [chineseCharacter, setChineseCharacter] = useState("");
  const [meaning, setMeaning] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editedKanji) {
      setTimeout(() => {
        setKanjiId(editedKanji.kanji_id);
        setCharacter(editedKanji.character);
        setOnReading(editedKanji.on_reading);
        setKunReading(editedKanji.kun_reading);
        setChineseCharacter(editedKanji.chinese_character);
        setMeaning(editedKanji?.meaning ?? "");
      }, 0);
    } else {
      const maxKanjiId = Math.max(...kanjiCards.map((x) => x.kanji_id || 0));
      setTimeout(() => {
        setKanjiId(maxKanjiId + 1);
        setCharacter("");
        setOnReading("");
        setKunReading("");
        setChineseCharacter("");
        setMeaning("");
      }, 0);
    }
  }, [isOpen, isEditMode, editedKanji, kanjiCards]);

  return {
    kanjiId,
    setKanjiId,
    character,
    setCharacter,
    onReading,
    setOnReading,
    kunReading,
    setKunReading,
    chineseCharacter,
    setChineseCharacter,
    meaning,
    setMeaning,
    isEditMode,
  };
}

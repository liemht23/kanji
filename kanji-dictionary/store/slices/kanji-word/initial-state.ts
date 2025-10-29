import { INITIAL_KANJI_ID, INITIAL_MAX_KANJI_ID, INITIAL_MIN_KANJI_ID } from "@/constants/const";
import { KanjiState } from "@/types/kanji-word";

export const kanjiInitialState: KanjiState = {
  kanjiWord: null,
  currentKanjiId: INITIAL_KANJI_ID,
  maxKanjiId: INITIAL_MAX_KANJI_ID,
  minKanjiId: INITIAL_MIN_KANJI_ID,
  loading: false,
};

export default kanjiInitialState;

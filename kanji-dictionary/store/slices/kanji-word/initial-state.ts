import { INITIAL_KANJI_ID } from "@/constants/const";
import { KanjiState } from "@/types/kanji-word";

export const kanjiInitialState: KanjiState = {
  kanjiWord: null,
  currentKanjiId: INITIAL_KANJI_ID,
  loading: false,
};

export default kanjiInitialState;

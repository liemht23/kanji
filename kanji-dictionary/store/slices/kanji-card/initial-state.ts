import { defaultKanjiData } from "@/app/(pages)/kanji/components/KanjiCard/const";
import {
  INITIAL_KANJI_ID,
  INITIAL_MAX_KANJI_ID,
  INITIAL_MIN_KANJI_ID,
} from "@/constants/const";
import { KanjiCardState } from "@/types/kanji-word";

export const kanjiCardInitialState: KanjiCardState = {
  kanjiWord: defaultKanjiData,
  editedKanji: null,
  currentKanjiId: INITIAL_KANJI_ID,
  maxKanjiId: INITIAL_MAX_KANJI_ID,
  minKanjiId: INITIAL_MIN_KANJI_ID,
  loading: false,
};

export default kanjiCardInitialState;

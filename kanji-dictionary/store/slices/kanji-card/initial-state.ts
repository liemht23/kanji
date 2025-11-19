import {
  DEFAULT_KANJI_DATA,
  INITIAL_KANJI_ID,
  INITIAL_MAX_KANJI_ID,
  INITIAL_MIN_KANJI_ID,
} from "@/constants/kanji-const";
import { KanjiCardState } from "@/types/kanji-word";

export const kanjiCardInitialState: KanjiCardState = {
  kanjiWord: DEFAULT_KANJI_DATA,
  editedKanji: null,
  currentKanjiId: INITIAL_KANJI_ID,
  maxKanjiId: INITIAL_MAX_KANJI_ID,
  minKanjiId: INITIAL_MIN_KANJI_ID,
  loading: false,
};

export default kanjiCardInitialState;

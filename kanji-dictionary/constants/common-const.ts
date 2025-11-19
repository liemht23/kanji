import { LEVEL, READING_TYPE } from "@/enum/common-enum";

export const NEXT_STEP_SIZE = 1;
export const PREVIOUS_STEP_SIZE = -1;

export const LEVEL_OPTION = [
  { value: LEVEL.N1, label: "N1" },
  { value: LEVEL.N2, label: "N2" },
  { value: LEVEL.N3, label: "N3" },
  { value: LEVEL.N4, label: "N4" },
  { value: LEVEL.N5, label: "N5" },
];

export const READING_TYPE_OPTION = [
  { value: READING_TYPE.NONE, label: "NONE" },
  { value: READING_TYPE.ON, label: "ON" },
  { value: READING_TYPE.KUN, label: "KUN" },
  { value: READING_TYPE.SPECIAL, label: "SPECIAL" },
];

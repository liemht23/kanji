export interface WordPart {
  word: string;
  pronun: string;
  flg: "onyomi" | "kunyomi" | "none";
}

export interface Example {
  words: WordPart[];
}

export interface KanjiData {
  no: string;
  img: string;
  onyomi: string;
  kunyomi: string;
  mean: string;
  example: Example[];
}

export interface KanjiState {
  kanjiWord: KanjiData | null;
  loading: boolean;
}
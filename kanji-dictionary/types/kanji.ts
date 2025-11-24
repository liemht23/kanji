import { Vocab } from "./vocab";

export interface Kanji {
  id: string | undefined;
  kanji_id: number;
  character: string;
  img_url: string;
  on_reading: string;
  kun_reading: string;
  chinese_character: string;
  meaning: string;
  example: Vocab[];
  example_images: string[];
  is_published: boolean;
}

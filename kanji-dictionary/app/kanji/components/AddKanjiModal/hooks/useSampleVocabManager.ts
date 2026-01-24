import { useAppDispatch } from "@/store/hook";
import {
  setSampleVocab,
  removeSampleVocabFromList,
} from "@/store/slices/kanji-collection";
import { Vocab } from "@/types/vocab";

// setIsOpenAddSampleKanjiModal is a function to control the open state of AddSampleKanjiModal
export function useSampleVocabManager(
  setIsOpenAddSampleKanjiModal: (open: boolean) => void,
) {
  const dispatch = useAppDispatch();

  const handleEditSampleVocab = (sampleVocab: Vocab) => {
    dispatch(setSampleVocab(sampleVocab));
    setIsOpenAddSampleKanjiModal(true);
  };

  const handleDeleteSampleVocab = (id: number) => {
    dispatch(removeSampleVocabFromList(id));
  };

  return {
    handleEditSampleVocab,
    handleDeleteSampleVocab,
  };
}

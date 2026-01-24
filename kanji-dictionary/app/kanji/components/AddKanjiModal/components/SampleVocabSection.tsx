import React from "react";
import Tooltip from "@/components/common/Tooltip";
import { SquarePlus } from "lucide-react";
import SampleVocabTable from "./SampleVocabTable";
import { Vocab } from "@/types/vocab";

interface SampleVocabSectionProps {
  listSampleVocab: Vocab[];
  handleEditSampleVocab: (vocab: Vocab) => void;
  handleDeleteSampleVocab: (id: number) => void;
  setIsOpenAddSampleKanjiModal: (open: boolean) => void;
}

const SampleVocabSection = ({
  listSampleVocab,
  handleEditSampleVocab,
  handleDeleteSampleVocab,
  setIsOpenAddSampleKanjiModal,
}: SampleVocabSectionProps) => {
  const handleOpenAddSampleKanjiModal = () =>
    setIsOpenAddSampleKanjiModal(true);
  return (
    <div className="col-span-8 px-4 border-l border-black-100 pl-4">
      <div className="flex items-start gap-2">
        <div className="text-lg font-semibold">Example</div>
        <Tooltip text="Add Sample Kanji">
          <SquarePlus
            className="w-6 h-6 text-black-400 cursor-pointer hover:text-black-900"
            onClick={handleOpenAddSampleKanjiModal}
          />
        </Tooltip>
      </div>
      <div className="max-h-[530px] overflow-y-auto rounded-lg">
        <SampleVocabTable
          listSampleVocab={listSampleVocab}
          handleEditSampleVocab={handleEditSampleVocab}
          handleDeleteSampleVocab={handleDeleteSampleVocab}
        />
      </div>
    </div>
  );
};

export default SampleVocabSection;

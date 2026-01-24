import React from "react";
import { Vocab } from "@/types/vocab";
import { getLabel } from "@/utils/select-option";
import { LEVEL_OPTION } from "@/constants/common-const";

interface SampleVocabTableProps {
  listSampleVocab: Vocab[];
  handleEditSampleVocab: (vocab: Vocab) => void;
  handleDeleteSampleVocab: (id: number) => void;
}

const SampleVocabTable = ({
  listSampleVocab,
  handleEditSampleVocab,
  handleDeleteSampleVocab,
}: SampleVocabTableProps) => {
  const handleEditClick = (sampleVocab: Vocab, e: React.MouseEvent) => {
    e.preventDefault();
    handleEditSampleVocab(sampleVocab);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    handleDeleteSampleVocab(id);
  };
  return (
    <div className="max-h-[530px] overflow-y-auto rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
          <tr>
            <th className="text-center border border-gray-300 w-1/10">No.</th>
            <th className="p-3 text-left border border-gray-300 w-3/10">
              Sample Kanji
            </th>
            <th className="p-3 text-center border border-gray-300 w-1/10">
              Level
            </th>
            <th className="p-3 text-left border border-gray-300 w-3/10">
              Meaning
            </th>
            <th className="p-3 text-center border border-gray-300 w-1/5">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {listSampleVocab.length === 0 ? (
            <tr className="transition-colors duration-200 h-16">
              <td
                colSpan={5}
                className="p-3 border border-gray-300 text-center"
              >
                No data
              </td>
            </tr>
          ) : (
            listSampleVocab.map((sampleVocab, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="p-3 text-center border border-gray-300">
                  {sampleVocab.id}
                </td>
                <td className="p-3 border border-gray-300">
                  {sampleVocab.vocab}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {getLabel(LEVEL_OPTION, sampleVocab.level)}
                </td>
                <td className="p-3 text-center border border-gray-300">
                  {sampleVocab.meaning}
                </td>
                <td className="p-3 border border-gray-300 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={(e) => handleEditClick(sampleVocab, e)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(sampleVocab.id, e)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SampleVocabTable;

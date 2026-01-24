"use client";
import Tooltip from "@/components/common/Tooltip";
import { CircleX } from "lucide-react";
import AddSampleKanjiModal from "../AddSampleKanjiModal";
import { useKanjiModalForm } from "./useKanjiModalForm";
import SampleVocabSection from "./components/SampleVocabSection";
import KanjiInfoFormSection from "./components/KanjiInfoFormSection";
import ModalActionButtons from "./components/ModalActionButtons";

interface AddKanjiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddKanjiModal = ({ isOpen, onClose }: AddKanjiModalProps) => {
  // Use custom hook for managing form state and logic
  const {
    isOpenAddSampleKanjiModal,
    setIsOpenAddSampleKanjiModal,
    isAllowUpload,
    kanjiId,
    setKanjiId,
    character,
    onReading,
    setOnReading,
    kunReading,
    setKunReading,
    chineseCharacter,
    setChineseCharacter,
    meaning,
    setMeaning,
    existingImgUrl,
    newMainPreview,
    existingExampleUrls,
    newExampleFiles,
    newExamplePreviews,
    listSampleVocab,
    onPickMainImage,
    onPickExampleImages,
    removeMainImage,
    removeExistingExampleAt,
    removeNewExampleAt,
    handleEditSampleVocab,
    handleDeleteSampleVocab,
    handleCancel,
    handleOnBlur,
    handleUploadKanjiImg,
    isEditMode,
    handleCharacterChange,
    handleSubmitForm,
  } = useKanjiModalForm(isOpen, onClose);

  if (!isOpen) return;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />

        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 p-6">
          <header className="flex items-center justify-between pl-4 mb-4">
            <h2 className="text-xl font-semibold">
              {isEditMode ? "EDIT KANJI" : "ADD KANJI"}
            </h2>
            <Tooltip text="Close">
              <CircleX
                className="w-8 h-8 text-black-400 cursor-pointer hover:text-black-900"
                onClick={handleCancel}
              />
            </Tooltip>
          </header>

          <form onSubmit={handleSubmitForm}>
            <div className="grid grid-cols-12 mb-5">
              <KanjiInfoFormSection
                kanjiId={kanjiId}
                setKanjiId={setKanjiId}
                onReading={onReading}
                setOnReading={setOnReading}
                newMainPreview={newMainPreview}
                existingImgUrl={existingImgUrl}
                isAllowUpload={isAllowUpload}
                removeMainImage={removeMainImage}
                handleUploadKanjiImg={handleUploadKanjiImg}
                onPickMainImage={onPickMainImage}
                character={character}
                handleCharacterChange={handleCharacterChange}
                handleOnBlur={handleOnBlur}
                kunReading={kunReading}
                setKunReading={setKunReading}
                chineseCharacter={chineseCharacter}
                setChineseCharacter={setChineseCharacter}
                meaning={meaning}
                setMeaning={setMeaning}
                existingExampleUrls={existingExampleUrls}
                newExamplePreviews={newExamplePreviews}
                newExampleFiles={newExampleFiles}
                onPickExampleImages={onPickExampleImages}
                removeExistingExampleAt={removeExistingExampleAt}
                removeNewExampleAt={removeNewExampleAt}
              />

              <SampleVocabSection
                listSampleVocab={listSampleVocab}
                handleEditSampleVocab={handleEditSampleVocab}
                handleDeleteSampleVocab={handleDeleteSampleVocab}
                setIsOpenAddSampleKanjiModal={setIsOpenAddSampleKanjiModal}
              />
            </div>

            <ModalActionButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>

      <AddSampleKanjiModal
        isOpen={isOpenAddSampleKanjiModal}
        onClose={() => setIsOpenAddSampleKanjiModal(false)}
      />
    </>
  );
};

export default AddKanjiModal;

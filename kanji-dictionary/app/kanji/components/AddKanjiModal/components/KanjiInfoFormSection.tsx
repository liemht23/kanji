import React from "react";
import KanjiTextInput from "./KanjiTextInput";
import KanjiImageUploader from "./KanjiImageUploader";
import ExampleImagesUploader from "./ExampleImagesUploader";

interface KanjiInfoFormSectionProps {
  kanjiId: number | "";
  setKanjiId: (v: number | "") => void;
  onReading: string;
  setOnReading: (v: string) => void;
  newMainPreview: string | null;
  existingImgUrl: string | null;
  isAllowUpload: boolean;
  removeMainImage: () => void;
  handleUploadKanjiImg: () => void;
  onPickMainImage: (file?: File) => void;
  character: string;
  handleCharacterChange: (v: string) => void;
  handleOnBlur: () => void;
  kunReading: string;
  setKunReading: (v: string) => void;
  chineseCharacter: string;
  setChineseCharacter: (v: string) => void;
  meaning: string;
  setMeaning: (v: string) => void;
  existingExampleUrls: string[];
  newExamplePreviews: string[];
  newExampleFiles: File[];
  onPickExampleImages: (files: File[]) => void;
  removeExistingExampleAt: (idx: number) => void;
  removeNewExampleAt: (idx: number) => void;
}

const KanjiInfoFormSection = ({
  kanjiId,
  setKanjiId,
  onReading,
  setOnReading,
  newMainPreview,
  existingImgUrl,
  isAllowUpload,
  removeMainImage,
  handleUploadKanjiImg,
  onPickMainImage,
  character,
  handleCharacterChange,
  handleOnBlur,
  kunReading,
  setKunReading,
  chineseCharacter,
  setChineseCharacter,
  meaning,
  setMeaning,
  existingExampleUrls,
  newExamplePreviews,
  newExampleFiles,
  onPickExampleImages,
  removeExistingExampleAt,
  removeNewExampleAt,
}: KanjiInfoFormSectionProps) => {
  const handleKanjiIdChange = (value: string | number) => {
    setKanjiId(value ? Number(value) : "");
  };
  return (
    <div className="col-span-4">
      <div className="grid grid-cols-12">
        <div className="col-span-6 px-4">
          <KanjiTextInput
            label="No."
            id="kanji_id"
            value={kanjiId}
            onChange={handleKanjiIdChange}
            placeholder="1"
            required
            disabled
          />
          <KanjiTextInput
            label="On Reading"
            id="on_reading"
            value={onReading}
            onChange={setOnReading}
            placeholder="タツ"
            required
          />
          <KanjiImageUploader
            newMainPreview={newMainPreview}
            existingImgUrl={existingImgUrl}
            isAllowUpload={isAllowUpload}
            removeMainImage={removeMainImage}
            handleUploadKanjiImg={handleUploadKanjiImg}
            onPickMainImage={onPickMainImage}
          />
        </div>
        <div className="col-span-6 px-4">
          <KanjiTextInput
            label="Character"
            id="character"
            value={character}
            onChange={handleCharacterChange}
            onBlur={handleOnBlur}
            placeholder="達"
            required
          />
          <KanjiTextInput
            label="Kun Reading"
            id="kun_reading"
            value={kunReading}
            onChange={setKunReading}
            placeholder="たち"
            required
          />
          <KanjiTextInput
            label="Chinese Character"
            id="chinese_character"
            value={chineseCharacter}
            onChange={setChineseCharacter}
            placeholder="ĐẠT"
            required
          />
          <KanjiTextInput
            label="Meaning"
            id="meaning"
            value={meaning}
            onChange={setMeaning}
            placeholder="tiễn"
          />
        </div>
      </div>
      <div className="mb-5">
        <ExampleImagesUploader
          existingExampleUrls={existingExampleUrls}
          newExamplePreviews={newExamplePreviews}
          newExampleFiles={newExampleFiles}
          onPickExampleImages={onPickExampleImages}
          removeExistingExampleAt={removeExistingExampleAt}
          removeNewExampleAt={removeNewExampleAt}
        />
      </div>
    </div>
  );
};

export default KanjiInfoFormSection;

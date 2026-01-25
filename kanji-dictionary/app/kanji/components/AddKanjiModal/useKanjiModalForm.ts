import { RootState } from "@/store/store";
import { Kanji } from "@/types/kanji";
import { uploadImage } from "@/lib/upload";
import {
  BUCKET_EXAMPLE_IMAGES,
  BUCKET_KANJI_IMAGES,
} from "@/constants/kanji-const";
import {
  clearListSampleVocab,
  setSelectedKanji,
  setEditedKanji,
  setListSampleVocab,
} from "@/store/slices/kanji-collection";
import {
  getKanjiByCollectionIdThunk,
  getKanjiImageUrlThunk,
  insertKanjiImageThunk,
  upsertKanjiThunk,
} from "@/store/slices/kanji-collection/thunk";
import { KanjiImages } from "@/types/kanji-images";
import { useModalState } from "./hooks/useModalState";
import { useSampleVocabManager } from "./hooks/useSampleVocabManager";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useKanjiFormState } from "./hooks/useKanjiFormState";
import { useKanjiImageUpload } from "./hooks/useKanjiImageUpload";
import { useEffect } from "react";

export function useKanjiModalForm(isOpen: boolean, onClose: () => void) {
  const {
    isOpen: isOpenAddSampleKanjiModal,
    setIsOpen: setIsOpenAddSampleKanjiModal,
  } = useModalState(false);
  const { handleEditSampleVocab, handleDeleteSampleVocab } =
    useSampleVocabManager(setIsOpenAddSampleKanjiModal);
  const { editedKanji, listSampleVocab, selectedCollection } = useAppSelector(
    (state: RootState) => state.kanji,
  );
  const {
    kanjiId,
    setKanjiId,
    character,
    setCharacter,
    onReading,
    setOnReading,
    kunReading,
    setKunReading,
    chineseCharacter,
    setChineseCharacter,
    meaning,
    setMeaning,
    isEditMode,
  } = useKanjiFormState(isOpen);

  const {
    isAllowUpload,
    setIsAllowUpload,
    existingImgUrl,
    setExistingImgUrl,
    newMainFile,
    setNewMainFile,
    newMainPreview,
    setNewMainPreview,
    existingExampleUrls,
    setExistingExampleUrls,
    newExampleFiles,
    setNewExampleFiles,
    newExamplePreviews,
    setNewExamplePreviews,
    onPickMainImage,
    onPickExampleImages,
    removeMainImage,
    removeExistingExampleAt,
    removeNewExampleAt,
  } = useKanjiImageUpload(isOpen);

  const dispatch = useAppDispatch();

  // Ensure existingImgUrl is set when editing
  useEffect(() => {
    if (isOpen && isEditMode && editedKanji && editedKanji.img_url) {
      setExistingImgUrl(editedKanji.img_url);
    }
    // If not in edit mode or no image, reset to null
    if (isOpen && (!isEditMode || !editedKanji || !editedKanji.img_url)) {
      setExistingImgUrl(null);
    }
  }, [isOpen, isEditMode, editedKanji, setExistingImgUrl]);

  // Ensure listSampleVocab is set when editing
  useEffect(() => {
    if (isOpen && isEditMode && editedKanji && editedKanji.example) {
      dispatch(setListSampleVocab(editedKanji.example));
    }
  }, [isOpen, isEditMode, editedKanji, dispatch]);

  const handleCharacterChange = (value: string) => {
    setCharacter(value);
    setExistingImgUrl(null);
    if (newMainPreview) {
      URL.revokeObjectURL(newMainPreview);
      setNewMainPreview(null);
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSaveKanji();
  };

  const handleSaveKanji = async () => {
    try {
      let img_url = "";
      if (newMainFile) {
        try {
          img_url = await uploadImage(newMainFile, BUCKET_KANJI_IMAGES);
          const kanjiImg: KanjiImages = {
            kanji: character,
            url: img_url,
          };
          await dispatch(insertKanjiImageThunk(kanjiImg)).unwrap();
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(msg);
          alert(`Upload kanji image failed: ${msg}`);
        }
      } else if (existingImgUrl) {
        img_url = existingImgUrl;
      } else {
        img_url = "";
      }

      const example_images: string[] = [...existingExampleUrls];
      if (newExampleFiles.length > 0) {
        try {
          const uploadedUrls = (
            await Promise.all(
              newExampleFiles.map(async (f) => {
                try {
                  return await uploadImage(f, BUCKET_EXAMPLE_IMAGES);
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : JSON.stringify(err);
                  console.error(msg);
                  return null;
                }
              }),
            )
          ).filter((url): url is string => Boolean(url));
          example_images.push(...uploadedUrls);
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(msg);
          alert(`Upload example images failed: ${msg}`);
        }
      }

      if (!selectedCollection) {
        return;
      }
      const kanjiData: Kanji = {
        id: isEditMode && editedKanji ? editedKanji.id : undefined,
        kanji_id: Number(kanjiId),
        character,
        on_reading: onReading,
        kun_reading: kunReading,
        chinese_character: chineseCharacter,
        meaning,
        img_url,
        example: listSampleVocab,
        example_images,
        is_published: false,
        collection_id: selectedCollection?.id,
      };

      await dispatch(upsertKanjiThunk({ data: kanjiData, isEdit: isEditMode }))
        .unwrap()
        .then((res) => {
          dispatch(clearListSampleVocab());
          if (selectedCollection) {
            dispatch(getKanjiByCollectionIdThunk(selectedCollection.id));
          }
          dispatch(setSelectedKanji(res));
          dispatch(setEditedKanji(null));
        });

      onClose();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error(msg);
      alert(`Save failed: ${msg}`);
    }
  };

  const handleCancel = () => {
    dispatch(clearListSampleVocab());
    dispatch(setEditedKanji(null));
    onClose();
  };

  const handleOnBlur = async () => {
    if (character && !newMainPreview && !existingImgUrl) {
      try {
        const url = await dispatch(getKanjiImageUrlThunk(character)).unwrap();
        if (url) {
          setExistingImgUrl(url);
          setIsAllowUpload(false);
        } else {
          setIsAllowUpload(true);
        }
      } catch {
        setIsAllowUpload(true);
      }
    }
  };

  const handleUploadKanjiImg = () => {
    const input = document.getElementById("kanji-image-upload");
    if (input) input.click();
  };

  return {
    isOpenAddSampleKanjiModal,
    setIsOpenAddSampleKanjiModal,
    isAllowUpload,
    kanjiId,
    setKanjiId,
    character,
    setCharacter,
    onReading,
    setOnReading,
    kunReading,
    setKunReading,
    chineseCharacter,
    setChineseCharacter,
    meaning,
    setMeaning,
    existingImgUrl,
    setExistingImgUrl,
    newMainFile,
    setNewMainFile,
    newMainPreview,
    setNewMainPreview,
    existingExampleUrls,
    setExistingExampleUrls,
    newExampleFiles,
    setNewExampleFiles,
    newExamplePreviews,
    setNewExamplePreviews,
    listSampleVocab,
    onPickMainImage,
    onPickExampleImages,
    removeMainImage,
    removeExistingExampleAt,
    removeNewExampleAt,
    handleEditSampleVocab,
    handleDeleteSampleVocab,
    handleSaveKanji,
    handleCancel,
    handleOnBlur,
    handleUploadKanjiImg,
    isEditMode,
    handleCharacterChange,
    handleSubmitForm,
  };
}

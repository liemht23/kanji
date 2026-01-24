import { useState, useEffect } from "react";

export function useKanjiImageUpload(isOpen: boolean) {
  // Main Image
  const [existingImgUrl, setExistingImgUrl] = useState<string | null>(null);
  const [newMainFile, setNewMainFile] = useState<File | null>(null);
  const [newMainPreview, setNewMainPreview] = useState<string | null>(null);
  const [isAllowUpload, setIsAllowUpload] = useState(false);

  // Example Images
  const [existingExampleUrls, setExistingExampleUrls] = useState<string[]>([]);
  const [newExampleFiles, setNewExampleFiles] = useState<File[]>([]);
  const [newExamplePreviews, setNewExamplePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      if (newMainPreview) URL.revokeObjectURL(newMainPreview);
      newExamplePreviews.forEach((u) => URL.revokeObjectURL(u));
      setTimeout(() => {
        setNewMainPreview(null);
        setNewExamplePreviews([]);
        setNewMainFile(null);
        setNewExampleFiles([]);
        setIsAllowUpload(false);
      }, 0);
    }
  }, [isOpen, newMainPreview, newExamplePreviews]);

  const onPickMainImage = (file?: File) => {
    if (newMainPreview) URL.revokeObjectURL(newMainPreview);
    if (!file) {
      setNewMainFile(null);
      setNewMainPreview(null);
      return;
    }
    setNewMainFile(file);
    setNewMainPreview(URL.createObjectURL(file));
    setIsAllowUpload(false);
  };

  const onPickExampleImages = (files: File[]) => {
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewExampleFiles((prev) => [...prev, ...files]);
    setNewExamplePreviews((prev) => [...prev, ...previews]);
  };

  const removeMainImage = () => {
    if (newMainPreview) URL.revokeObjectURL(newMainPreview);
    setNewMainFile(null);
    setNewMainPreview(null);
    setIsAllowUpload(false);
    const input = document.getElementById(
      "kanji-image-upload",
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const removeExistingExampleAt = (idx: number) => {
    setExistingExampleUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewExampleAt = (idx: number) => {
    URL.revokeObjectURL(newExamplePreviews[idx]);
    setNewExamplePreviews((prev) => prev.filter((_, i) => i !== idx));
    setNewExampleFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return {
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
  };
}

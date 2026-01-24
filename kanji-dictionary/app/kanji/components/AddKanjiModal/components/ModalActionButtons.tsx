import React from "react";

interface ModalActionButtonsProps {
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const ModalActionButtons = ({
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: ModalActionButtonsProps) => (
  <div className="flex justify-center gap-2">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-black-400 font-medium border border-black-400 rounded-xl
        hover:text-black-900 hover:border-black-900 
        transition-all duration-200 ease-in-out"
    >
      {cancelLabel}
    </button>
    <button
      type="submit"
      className="px-5 py-2 text-black-0 bg-blue-400 font-medium border border-black-400 rounded-xl
        hover:border-black-900
        transition-all duration-200 ease-in-out"
    >
      {submitLabel}
    </button>
  </div>
);

export default ModalActionButtons;

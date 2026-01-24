import { useState } from "react";

export function useModalState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  return { isOpen, setIsOpen };
}

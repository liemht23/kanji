"use client";
import { useEffect } from "react";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useLayout } from "@/app/context/LayoutContext";
import Spinner from "@/components/common/Spinner";
import VocabToolBar from "./components/VocabToolbar";
import VocabCard from "./components/VocabCard";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import {
  getAllVocabCollectionThunk,
  getVocabByCollectionIdThunk,
} from "@/store/slices/vocab-collection/thunk";
import {
  setSelectedCollection,
  setSelectedVocab,
} from "@/store/slices/vocab-collection";
import { LEVEL_OPTION } from "@/constants/common-const";
import { getLabel } from "@/utils/select-option";

const VocabPage = () => {
  const { isMobile } = useLayout();
  const { checking } = useAuthGuard();
  const dispatch = useAppDispatch();
  const {
    listVocabCollections,
    selectedCollection,
    vocabCards,
    selectedVocab,
    loading,
  } = useAppSelector((state: RootState) => state.vocabCollection);

  const handleBack = () => {
    // Clear selected collection and selected vocab when going back to collection list
    dispatch(setSelectedCollection(null));
    dispatch(setSelectedVocab(null));
  };

  useEffect(() => {
    dispatch(getAllVocabCollectionThunk()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    // Automatically select the first vocab card when vocabCards are loaded
    if (selectedVocab == null && vocabCards.length > 0) {
      dispatch(setSelectedVocab(vocabCards[0]));
    }
  }, [selectedVocab, vocabCards, dispatch]);

  useEffect(() => {
    if (selectedCollection?.id) {
      dispatch(getVocabByCollectionIdThunk(selectedCollection.id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load vocab:", err);
        });
    }
  }, [dispatch, selectedCollection]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={isMobile ? "p-4" : "px-10 py-8"}>
      <VocabToolBar
        isVocabFlashCard={!!selectedCollection}
        onBack={handleBack}
      />
      {!selectedCollection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-8">
          {listVocabCollections.map((collection) => (
            <button
              key={collection.id}
              className={`flex flex-col items-start justify-center p-8 bg-white border border-black-100 rounded-2xl shadow 
                hover:shadow-lg hover:bg-gray-50 transition cursor-pointer min-h-[140px] group`}
              onClick={() => dispatch(setSelectedCollection(collection))}
            >
              <div className="flex items-center gap-1 text-md font-bold">
                <div className="bg-orange-400 text-black-0 px-2 py-1 rounded-sm">
                  {getLabel(LEVEL_OPTION, collection.level)}
                </div>
                <div className="text-xl">{collection.title}</div>
              </div>
              <div className="text-base text-left text-gray-700 mt-4">
                {collection.description}
              </div>
              <div className="w-full text-center opacity-0 group-hover:opacity-100 text-xs text-gray-400 mt-2 transition">
                Nhấn để xem từ vựng
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <VocabCard />
        </div>
      )}
    </div>
  );
};

export default VocabPage;

"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useLayout } from "@/app/context/LayoutContext";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";
import Spinner from "@/components/common/Spinner";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { getLabel } from "@/utils/select-option";
import { LEVEL_OPTION } from "@/constants/common-const";
import {
  resetKanjiCollection,
  setSelectedKanji,
  setSelectedKanjiCollection,
} from "@/store/slices/kanji-collection";
import {
  getAllBookmarkedKanjiThunk,
  getAllKanjiCollectionThunk,
  getKanjiByCollectionIdThunk,
} from "@/store/slices/kanji-collection/thunk";
import KanjiListPane from "./components/KanjiListPane";

const KanjiPage = () => {
  const { isMobile } = useLayout();
  const { checking } = useAuthGuard();
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetKanjiCollection());
    };
  }, []);

  const { listKanjiCollections, selectedCollection, loading } = useAppSelector(
    (state: RootState) => state.kanji
  );

  useEffect(() => {
    dispatch(getAllKanjiCollectionThunk()).unwrap();
  }, [dispatch]);

  const handleBack = () => {
    // Clear selected collection and selected kanji when going back to collection list
    dispatch(setSelectedKanjiCollection(null));
    dispatch(setSelectedKanji(null));
  };

  useEffect(() => {
    if (selectedCollection?.id) {
      dispatch(getKanjiByCollectionIdThunk(selectedCollection.id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load kanji:", err);
        });

      dispatch(getAllBookmarkedKanjiThunk(selectedCollection.id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load bookmarked kanji:", err);
        });
    }
  }, [dispatch, selectedCollection?.id]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className={isMobile ? "p-4" : "px-10 py-8"}>
      <KanjiToolBar onBack={handleBack} />
      {!selectedCollection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-8">
          {listKanjiCollections.map((collection) => (
            <button
              key={collection.id}
              className={`flex flex-col items-start justify-center p-8 bg-white border border-black-100 rounded-2xl shadow 
                hover:shadow-lg hover:bg-gray-50 transition cursor-pointer min-h-[140px] group`}
              onClick={() => dispatch(setSelectedKanjiCollection(collection))}
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
        <>
          <KanjiCard />
          <KanjiListPane />
        </>
      )}
    </div>
  );
};

export default KanjiPage;

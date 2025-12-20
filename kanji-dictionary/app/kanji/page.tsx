"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useLayout } from "@/app/context/LayoutContext";
import KanjiCard from "./components/KanjiCard";
import KanjiToolBar from "./components/KanjiToolbar";
import Spinner from "@/components/common/Spinner";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { resetKanjiCollection } from "@/store/slices/kanji-collection";
import {
  getAllMemorizedKanjiThunk,
  getAllKanjiCollectionThunk,
  getKanjiByCollectionIdThunk,
} from "@/store/slices/kanji-collection/thunk";
import KanjiListPane from "./components/KanjiListPane";
import ListKanjiCollection from "./components/ListKanjiCollection";
import KanjiQuiz from "./components/KanjiQuiz";
import { cn } from "@/utils/class-name";

const KanjiPage = () => {
  const { isMobile } = useLayout();
  const { checking } = useAuthGuard();
  const dispatch = useAppDispatch();
  const { selectedCollection, toolbarState, loading } = useAppSelector(
    (state: RootState) => state.kanji
  );

  useEffect(() => {
    return () => {
      dispatch(resetKanjiCollection());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllKanjiCollectionThunk()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCollection?.id) {
      dispatch(getKanjiByCollectionIdThunk(selectedCollection.id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load kanji:", err);
        });

      dispatch(getAllMemorizedKanjiThunk(selectedCollection.id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to load memorized kanji:", err);
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
    <div className={cn("h-full", isMobile ? "p-4" : "px-10 py-8")}>
      <KanjiToolBar />
      {!selectedCollection ? (
        <ListKanjiCollection />
      ) : (
        <>
          {toolbarState.isOpenQuiz ? (
            <KanjiQuiz />
          ) : (
            <>
              <KanjiCard />
              <KanjiListPane />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default KanjiPage;

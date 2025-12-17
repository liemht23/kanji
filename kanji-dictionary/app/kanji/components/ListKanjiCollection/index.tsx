import { LEVEL_OPTION } from "@/constants/common-const";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSelectedKanjiCollection } from "@/store/slices/kanji-collection";
import { RootState } from "@/store/store";
import { getLabel } from "@/utils/select-option";

const ListKanjiCollection = () => {
  const dispatch = useAppDispatch();
  const { listKanjiCollections, loading } = useAppSelector(
    (state: RootState) => state.kanji
  );

  return (
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
            Click to open collection
          </div>
        </button>
      ))}
    </div>
  );
};

export default ListKanjiCollection;

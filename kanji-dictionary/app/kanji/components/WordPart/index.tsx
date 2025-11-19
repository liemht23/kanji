import { setWordPart } from "@/store/slices/sample-vocab";
import ReadingTypeSelector from "../ReadingSelector";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { READING_TYPE } from "@/enum/common-enum";

const WordPart = () => {
  const { word_parts } = useAppSelector(
    (state: RootState) => state.sampleVocab.currentSampleVocab
  );
  const dispatch = useAppDispatch();

  const handleAddWordPart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = word_parts.length + 1;
    const word = formData.get("word") as string;
    const pronun = formData.get("pronun") as string;
    const reading_type = Number(formData.get("reading_type")) as READING_TYPE;

    dispatch(setWordPart({ id, word, pronun, reading_type }));

    e.currentTarget.reset();
  };

  return (
    <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <form onSubmit={(e) => handleAddWordPart(e)}>
        <div className="grid grid-cols-12">
          <div className="col-span-6 px-4">
            <div className="mb-5">
              <label
                htmlFor="word"
                className="block mb-2 text-sm font-medium text-black-900"
              >
                Word
              </label>
              <input
                type="text"
                id="word"
                name="word"
                className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                placeholder="達"
                required
              />
            </div>
          </div>
          <div className="col-span-6 px-4">
            <div className="mb-5">
              <label
                htmlFor="pronun"
                className="block mb-2 text-sm font-medium text-black-900"
              >
                Pronunciation
              </label>
              <input
                type="text"
                id="pronun"
                name="pronun"
                className="border border-black-400 text-black-900 text-sm rounded-lg
                    focus:ring-blue-300 focus:border-blue-500 block w-full p-2.5"
                placeholder="だち"
              />
            </div>
          </div>
        </div>

        <div>
          <ReadingTypeSelector />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="px-5 py-2 text-black-0 bg-blue-400 font-medium border border-black-400 rounded-xl
               hover:border-black-900
               transition-all duration-200 ease-in-out"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default WordPart;

import { READING_TYPE } from "@/enum/kanji-word";

const ReadingTypeSelector = () => {
  return (
    <>
      <p className="px-4 block mb-2 text-sm font-medium text-black-900">
        Reading Type
      </p>
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center mb-4">
          <input
            id="noneReading"
            type="radio"
            name="reading_type"
            value={READING_TYPE.NONE}
            defaultChecked
            className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label
            htmlFor="noneReading"
            className="block ms-2 text-sm font-medium text-gray-900"
          >
            None
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="onReading"
            type="radio"
            name="reading_type"
            value={READING_TYPE.ON}
            className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label
            htmlFor="onReading"
            className="block ms-2 text-sm font-medium text-gray-900"
          >
            On Reading
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="kunReading"
            type="radio"
            name="reading_type"
            value={READING_TYPE.KUN}
            className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label
            htmlFor="kunReading"
            className="block ms-2 text-sm font-medium text-gray-900"
          >
            Kun Reading
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="specialReading"
            type="radio"
            name="reading_type"
            value={READING_TYPE.SPECIAL}
            className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <label
            htmlFor="specialReading"
            className="block ms-2 text-sm font-medium text-gray-900"
          >
            Special Reading
          </label>
        </div>
      </div>
    </>
  );
};

export default ReadingTypeSelector;

import { SpecificMediaType } from "types";
import { SpecificMediaTypes } from "@/values";

type IQRBatchTabProps = {
  value: SpecificMediaType | null;
  onChange: (batchType: SpecificMediaType | null) => void;
};

const IQRBatchTab = ({ value, onChange }: IQRBatchTabProps) => {
  const handlePick = (specificMediaType: SpecificMediaType): void => {
    if (specificMediaType === value) {
      onChange(null);
    } else {
      onChange(specificMediaType);
    }
  };

  return (
    <div className="px-2">
      <div
        className={`
        relative flex flex-wrap w-full h-full overflow-y-scroll p-2
        bg-base-100 border-base-300 border-2 border-b-0 rounded-t-2xl shadow-2xl`}
      >
        {SpecificMediaTypes.map((specificMediaType) => (
          <span
            key={specificMediaType}
            onClick={() => handlePick(specificMediaType)}
            className={`btn m-1 p-2 text-md shadow-md ${
              value === specificMediaType
                ? "btn-info"
                : "bg-blue-100 border-blue-200"
            }`}
          >
            {specificMediaType}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IQRBatchTab;

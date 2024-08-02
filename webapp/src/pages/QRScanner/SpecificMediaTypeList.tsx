import { SpecificMediaType } from "types";
import { SpecificMediaTypes } from "@/values";

type SpecificMediaTypeListProps = {
  value?: SpecificMediaType;
  onClick: (specificMediaType: SpecificMediaType) => void;
};

const SpecificMediaTypeList = ({ onClick }: SpecificMediaTypeListProps) => {
  return (
    <>
      {SpecificMediaTypes.map((specificMediaType) => {
        <span
          key={specificMediaType}
          onClick={() => onClick(specificMediaType)}
          className="btn m-1 p-4 text-lg"
        >
          {specificMediaType}
        </span>;
      })}
    </>
  );
};

export default SpecificMediaTypeList;

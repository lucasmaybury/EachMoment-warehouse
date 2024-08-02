import { FaX } from "react-icons/fa6";
import { SpecificMediaType } from "types";
import { MediaTypes } from "@/values";

type SpecificMediaTypePickerProps = {
  handlePick: (specificMediaType: SpecificMediaType) => void;
  handleExitClick: () => void;
};
const SpecificMediaTypePicker = ({
  handlePick,
  handleExitClick,
}: SpecificMediaTypePickerProps) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    handlePick(e.currentTarget.textContent as SpecificMediaType);
  };

  return (
    <>
      <div className="fixed top-0 z-50 h-dvh w-dvw">
        <span className="flex flex-col justify-end h-full px-4 pb-16">
          {Object.values(MediaTypes).map(
            (specificMediaTypes: SpecificMediaType[], id: number) => (
              <div key={id} className="flex flex-wrap justify-end m-3">
                {specificMediaTypes.map(
                  (specificMediaType: SpecificMediaType) => (
                    <span
                      key={specificMediaType}
                      onClick={handleClick}
                      className="btn m-1 p-4 text-lg"
                    >
                      {specificMediaType}
                    </span>
                  )
                )}
              </div>
            )
          )}
        </span>
        <FaX
          onClick={handleExitClick}
          className="fixed top-2 right-2 text-2xl text-white"
        />
      </div>
      <div className="fixed top-0 z-40 h-dvh w-dvw opacity-65 bg-black" />
    </>
  );
};
export default SpecificMediaTypePicker;

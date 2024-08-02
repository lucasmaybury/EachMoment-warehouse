import { FaCircleXmark } from "react-icons/fa6";

type FloatingIndicatorProps = {
  show: boolean;
  position: "top" | "bottom" | "centre";
  cancel?: () => void;
  children: React.ReactNode;
};

const FloatingIndicator = ({
  show,
  position,
  cancel,
  children,
}: FloatingIndicatorProps) => {
  const positionClass = (() => {
    switch (position) {
      case "top":
        return "top-4";
      case "bottom":
        return "bottom-4";
      case "centre":
        return "top-1/2 -translate-y-1/2";
      default:
        return 1;
    }
  })();
  return (
    <>
      {show && (
        <div
          className={`absolute w-fit m-auto left-0 right-0 z-10 ${positionClass}`}
        >
          <span className="badge flex-inline items-center p-4 opacity-85 border-gray-500">
            {children}
            {cancel && (
              <FaCircleXmark
                onClick={cancel}
                className="ml-2 -mr-1 text-gray-500"
              />
            )}
          </span>
        </div>
      )}
    </>
  );
};
export default FloatingIndicator;

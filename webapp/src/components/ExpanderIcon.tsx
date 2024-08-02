import {
  FaAngleDown as ExpandIcon,
  FaAngleUp as RetractIcon,
} from "react-icons/fa";

type ExpanderIconProps = {
  isOpen: boolean;
};

const ExpanderIcon = ({ isOpen }: ExpanderIconProps) => {
  return (
    <>
      {isOpen ? (
        <RetractIcon className="my-auto" />
      ) : (
        <ExpandIcon className="my-auto" />
      )}
    </>
  );
};
export default ExpanderIcon;

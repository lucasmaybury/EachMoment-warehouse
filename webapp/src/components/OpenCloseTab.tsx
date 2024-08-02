import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface Props {
  open: boolean;
  tabTitle: string;
  position?: "top" | "bottom";
}

const OpenCloseTab = ({ open, tabTitle, position }: Props) => {
  const chevronDown = position === "top" ? !open : open;
  return (
    <div
      className={`inline-flex items-center bg-base-100 border-2 border-base-300  px-4 py-1 ${position == "top" ? "border-t-0 rounded-b-lg" : "border-b-0 rounded-t-lg"}`}
    >
      <span className="mr-2">{tabTitle}</span>
      {chevronDown ? <FaChevronDown /> : <FaChevronUp />}
    </div>
  );
};

export default OpenCloseTab;

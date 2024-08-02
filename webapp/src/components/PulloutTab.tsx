import { ReactNode } from "react";
import OpenCloseTab from "./OpenCloseTab";

type PulloutTabProps = {
  tabTitle: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  height: number;
  left?: string;
  right?: string;
  children: ReactNode;
};

const PulloutTab = ({
  tabTitle,
  open,
  setOpen,
  height,
  left,
  right,
  children,
}: PulloutTabProps) => {
  const handleTabClick = () => setOpen(!open);

  return (
    <div
      style={{
        height,
        bottom: open ? 18 : -height,
        transitionProperty: "all",
        transitionDuration: ".2s",
        transitionTimingFunction: "cubic-bezier(0, 1, 0.5, 1)",
      }}
      className="fixed z-40 flex flex-col w-full"
    >
      <div
        onClick={handleTabClick}
        style={{ left: left ?? "auto", right: right ?? "auto" }}
        className={`absolute z-50 -translate-y-[calc(100%-2px)] whitespace-nowrap
        ${right ? "translate-x-1/2" : "-translate-x-1/2"}`}
      >
        <OpenCloseTab open={open} tabTitle={tabTitle} />
      </div>

      {children}
    </div>
  );
};

export default PulloutTab;

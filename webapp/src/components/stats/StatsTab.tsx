import { useState } from "react";
import Stats from "./Stats";
import OpenCloseTab from "../OpenCloseTab";
import { Order } from "@/types";

type StatsTabProps = {
  orders: Order[];
};

const StatsTab = ({ orders }: StatsTabProps) => {
  const [open, setOpen] = useState(false);
  const height = 280;
  const topPosition = 64;
  const handleTabClick = () => setOpen(!open);

  return (
    <div
      style={{
        height,
        top: open ? topPosition : topPosition - height,
        transitionProperty: "all",
        transitionDuration: ".2s",
        transitionTimingFunction: "cubic-bezier(0, 1, 0.5, 1)",
      }}
      className="fixed w-full z-[15]"
    >
      <div className="sm:px-20">
        <div>
          <Stats orders={orders} />
        </div>
        <div
          className="w-fit z-10 left-0 right-0 mx-auto"
          onClick={handleTabClick}
        >
          <OpenCloseTab open={open} tabTitle={"Stats"} position="top" />
        </div>
      </div>
    </div>
  );
};
export default StatsTab;

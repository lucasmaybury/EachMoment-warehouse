import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { cdlHiglightDays } from "../values";
import HoverTooltip from "./HoverTooltip";
import { CDL } from "types";

interface CDLIndicatorProps {
  cdl: CDL | null;
}

const CDLIndicator = ({ cdl }: CDLIndicatorProps) => {
  const [themeColour, setThemeColour] = useState("");

  useEffect(() => {
    if (!cdl) return;
    const dueDate = dayjs(cdl.date);
    const currentDate = dayjs().startOf("day");

    const getColour = (): string => {
      const redBoundary = currentDate
        .add(cdlHiglightDays.danger, "day")
        .add(1, "day");
      const amberBoundary = currentDate
        .add(cdlHiglightDays.warning, "day")
        .add(1, "day");

      if (dueDate.isBefore(redBoundary)) {
        return "bg-red-400";
      } else if (dueDate.isBefore(amberBoundary)) {
        return "bg-yellow-400";
      } else {
        return "bg-green-400";
      }
    };

    setThemeColour(getColour());
  }, [cdl]);

  if (!cdl) {
    return <div className={`badge badge-sm badge-indicator`} />;
  }
  return (
    <HoverTooltip
      source={
        <div
          className={`badge badge-indicator badge-sm ${
            themeColour && `${themeColour}`
          }`}
        />
      }
      tooltip={
        <div className="flex flex-col py-1 min-w-32">
          <div className="flex flex-row justify-between font-bold mb-3 px-2">
            <span>CDL:</span>
            <span>{dayjs(cdl.date).format("DD/MM/YYYY")}</span>
          </div>
          <span className="bg-gray-100 p-2 rounded-md">{cdl.note}</span>
        </div>
      }
    />
  );
};

export default CDLIndicator;

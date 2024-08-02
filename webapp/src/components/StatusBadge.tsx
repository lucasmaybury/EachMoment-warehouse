import React from "react";
import { OrderStatus } from "types";

const statusStyles: Record<OrderStatus, string> = {
  Default: "bg-gray-300",
  "[MB] Dispatched": "bg-fuchsia-500 text-base-100",
  "[MB] Restoration": "bg-purple-400 text-base-100",
  "[MB] Digitisation": "bg-blue-400 text-base-100",
  "[MB] Quality Control": "bg-yellow-300",
  "[MB] Finalising": "bg-green-300",
  "[MB] Received": "bg-teal-400 text-base-100",
  "[MB] Return Dispatched": "bg-rose-400 text-base-100",
  "[MB] Payment Pending": "bg-orange-300",
  "[MB] Depot Received": "bg-green-600 text-base-100",
  "[MB] Depot Dispatched": "bg-orange-400 text-base-100",
};

type StatusBadgeProps = {
  status: OrderStatus;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  innerClasses?: string;
};

const StatusBadge = ({
  status,
  onClick,
  innerClasses = "",
}: StatusBadgeProps) => {
  return (
    <span
      onClick={(e) => onClick && onClick(e)}
      className={`
        badge w-28 md:w-44 h-12 md:h-1 px-1 
        text-center whitespace-pre-wrap md:whitespace-nowrap overflow-ellipsis 
        ${statusStyles[status] ?? ""}
        ${innerClasses}`}
    >
      {status}
    </span>
  );
};
export default StatusBadge;

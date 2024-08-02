import { OrderStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import { FaArrowRight as ArrowNextIcon } from "react-icons/fa6";

type StatusTransitionProps = {
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
};

const StatusTransition = ({ oldStatus, newStatus }: StatusTransitionProps) => {
  return (
    <div className="flex flex-row items-center justify-center my-3">
      <StatusBadge status={oldStatus} />
      <ArrowNextIcon className="mx-3 text-xl" />
      <StatusBadge status={newStatus} />
    </div>
  );
};
export default StatusTransition;

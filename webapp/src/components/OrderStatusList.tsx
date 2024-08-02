import { OrderStatus } from "types";
import { OrderStatuses } from "../values";
import StatusBadge from "./StatusBadge";

type OrderStatusListProps = {
  selected?: OrderStatus | null;
  handleClick: (status: OrderStatus) => void;
};

const OrderStatusList = ({
  selected = null,
  handleClick,
}: OrderStatusListProps) => {
  return (
    <ul className="flex flex-col w-fit p-1 bg-base-100">
      {OrderStatuses.map((status, index) => (
        <li key={index}>
          <div className="my-1 p-0">
            <StatusBadge
              status={status}
              onClick={() => handleClick(status)}
              innerClasses={`btn px-0 ${
                selected === status &&
                "!bg-white !text-black !font-bold border-2 border-gray-400"
              }`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
export default OrderStatusList;

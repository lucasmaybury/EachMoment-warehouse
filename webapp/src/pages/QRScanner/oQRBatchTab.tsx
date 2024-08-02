import OrderStatusList from "../../components/OrderStatusList.js";
import { OrderStatus } from "types";

type OQRBatchTabProps = {
  value: OrderStatus | null;
  onChange: (batchType: OrderStatus | null) => void;
  width?: string;
};

const OQRBatchTab = ({ value, onChange, width }: OQRBatchTabProps) => {
  const handlePick = (newStatus: OrderStatus): void => {
    if (newStatus === value) {
      onChange(null);
    } else {
      onChange(newStatus);
    }
  };

  return (
    <div
      className={`
        absolute right-1/4 translate-x-1/2
        flex justify-center
        bg-base-100 border-x-2 border-base-300`}
      style={{ width }}
    >
      <OrderStatusList selected={value} handleClick={handlePick} />
    </div>
  );
};

export default OQRBatchTab;

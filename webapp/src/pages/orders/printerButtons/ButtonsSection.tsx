import React from "react";
import { Order } from "types";
import OrderQRButton from "./OrderQRButton";
import ItemQRButton from "./ItemQRButton";
import NISButton from "./NISButton";
import ReportButton from "./ReportButton";

interface ButtonsSectionProps {
  order: Order;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({ order }) => {
  const buttonClasses = "btn btn-info text-base-100 w-24 h-14 md:w-fit m-2";

  return (
    <div className="p-4">
      <div className="flex w-full flex-wrap items-center justify-center">
        <ReportButton className={buttonClasses} />
        <NISButton className={buttonClasses} />
        <OrderQRButton orderId={order.id} className={buttonClasses} />
        <ItemQRButton orderId={order.id} className={buttonClasses} />
      </div>
    </div>
  );
};

export default ButtonsSection;

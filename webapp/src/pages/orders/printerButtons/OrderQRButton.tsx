import { printOQR } from "@/utils";
import React, { useState } from "react";

interface OrderQRButtonProps {
  orderId: string;
  className?: string;
}

const OrderQRButton: React.FC<OrderQRButtonProps> = ({
  orderId,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintOrderQR = async () => {
    setIsLoading(true);
    await printOQR(orderId);
    setIsLoading(false);
  };

  return (
    <button
      onClick={handlePrintOrderQR}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        "Print oQR"
      )}
    </button>
  );
};

export default OrderQRButton;

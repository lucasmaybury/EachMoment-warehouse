import { printIQRs } from "@/utils";
import React, { useState } from "react";

interface ItemQRButtonProps {
  orderId: string;
  className?: string;
}

const ItemQRButton = ({ orderId, className }: ItemQRButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalLabels, setTotalLabels] = useState<number>(6);

  const handlePrintItemQR = async () => {
    setIsLoading(true);
    await printIQRs(orderId, totalLabels);
    setIsLoading(false);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalLabels(Number(event.target.value));
  };

  return (
    <>
      <button className={`${className} w-36 pr-1`} disabled={isLoading}>
        <span
          onClick={() => {
            !isLoading && handlePrintItemQR();
          }}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Print iQR"
          )}
        </span>

        <select
          onChange={handleLabelChange}
          disabled={isLoading}
          className="select text-black"
        >
          {[6, 12, 24, 36, 48, 96].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </button>
    </>
  );
};

export default ItemQRButton;

import { printNameItSheet } from "@/utils";
import React from "react";

interface NISButtonProps {
  className?: string;
}

const NISButton: React.FC<NISButtonProps> = ({ className }) => {
  const onClick = () => {
    printNameItSheet();
    console.log("Name-it Sheet button clicked");
  };
  return (
    <button onClick={onClick} className={className}>
      Name-it Sheet
    </button>
  );
};

export default NISButton;

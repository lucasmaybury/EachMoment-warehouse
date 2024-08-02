import React from "react";

interface ReportButtonProps {
  className?: string;
  onClick?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ className, onClick }) => {
  return (
    <button onClick={onClick} className={className}>
      Lab Report
    </button>
  );
};

export default ReportButton;

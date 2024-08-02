import React, { useState } from "react";

type HoverTooltipProps = {
  source: React.ReactNode;
  tooltip: React.ReactNode;
};

const HoverTooltip = ({ source, tooltip }: HoverTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const toggleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleOpen}
    >
      {source}
      {isOpen && (
        <div className="absolute left-1/2 md:left-auto max-md:-translate-x-1/2">
          <div className="bg-white border-2 border-gray-200 shadow-lg py-3 px-4 rounded-md">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverTooltip;

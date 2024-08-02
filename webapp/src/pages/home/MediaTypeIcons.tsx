import React from "react";
import { FaCamera, FaFilm, FaTv } from "react-icons/fa6";

type MediaTypeIconsProps = {
  mediaTypes: {
    av: boolean;
    cine: boolean;
    photo: boolean;
  };
};

const MediaTypeIcons: React.FC<MediaTypeIconsProps> = ({ mediaTypes }) => {
  const iconClasses = "m-[3px] text-base";
  return (
    <div className="media-type-icons flex flex-row w-fit p-1 bg-gray-100 rounded-md">
      <FaTv className={`${iconClasses} ${mediaTypes?.av ? "" : "invisible"}`} />
      <FaFilm
        className={`${iconClasses} ${mediaTypes?.cine ? "" : "invisible"}`}
      />
      <FaCamera
        className={`${iconClasses} ${mediaTypes?.photo ? "" : "invisible"}`}
      />
    </div>
  );
};

export default MediaTypeIcons;

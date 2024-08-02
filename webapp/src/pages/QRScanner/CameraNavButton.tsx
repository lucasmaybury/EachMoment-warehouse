import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CameraNavButton = () => {
  const navigate = useNavigate();

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/qr`);
  };
  return (
    <div className="fixed bottom-4 right-4 z-20">
      <button
        onClick={clickHandler}
        className="bg-base-100 border-2 border-gray-300 rounded-full p-4"
      >
        <FaCamera size={24} />
      </button>
    </div>
  );
};

export default CameraNavButton;

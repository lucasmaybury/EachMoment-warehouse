import { RecordersContext } from "../../components/useRecorders";
import { Recorder } from "@/types";
import { useContext } from "react";
import { FaQrcode } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import CameraNavButton from "../QRScanner/CameraNavButton";
import { mdPadding } from "@/values/stylingClasses";
import { styles } from "@/values";
import { getIndexFromIp } from "@/utils";

const recordingRowClasses = `inline-flex justify-between items-center my-2 mx-3 p-3 ${styles.floatingElement}`;

const Recording = () => {
  const { recorders } = useContext(RecordersContext);

  const navigate = useNavigate();

  return (
    <>
      <div className={`flex flex-col pt-2 ${mdPadding}`}>
        {Object.values(recorders).map((recording: Recorder) => (
          <Link
            to={`/recording/${getIndexFromIp(recording.ip)}`}
            key={recording.ip}
            className={recordingRowClasses}
          >
            <span className="px-1 w-2/5">{recording.ip}</span>
            <span className="px-1">{recording.item}</span>
            <span className="px-1 ml-auto py-auto">
              {recording.recording ? (
                <div className="w-3 h-3 p-2 bg-red-500 rounded-full" />
              ) : (
                <div className="w-3 h-3 p-2 bg-gray-400 " />
              )}
            </span>
          </Link>
        ))}
        <button
          onClick={() => navigate(`/recording/new`)}
          className={recordingRowClasses}
        >
          <span className="inline-flex w-full justify-start items-center">
            <FaQrcode className="mr-3 text-lg" />
            <span>Add Recorder</span>
          </span>
        </button>
      </div>

      <CameraNavButton />
    </>
  );
};
export default Recording;

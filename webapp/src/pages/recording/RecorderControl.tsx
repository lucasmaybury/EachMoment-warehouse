import { Recorder } from "types";
import {
  deleteRecorder,
  getOrderFromItem,
  listenForRecorder,
  resetRecording,
  setRecorderItem,
  setRecorderName,
  startRecording,
  stopRecording,
} from "utils";
import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  iQRFormatRegex,
  iQRLegacyFormatRegex,
  legacyAppUrl,
  oQRFormatRegex,
  oQRLegacyFormatRegex,
  styles,
} from "@/values";
import { FaQrcode, FaCircleXmark, FaTrash } from "react-icons/fa6";
import { useAuth } from "@/context/useAuth";
import TapeRecorder from "@/components/TapeRecorder";
import useWindowDimensions from "@/context/useWindowDimensions";
import { ConfirmationModalContext } from "@/components/useConfirmationModal";
import LoadingSpinnerFull from "@/components/LoadingSpinnerFull";

const recordingCtrlBtn = "btn h-24 w-24 text-lg font-semibold my-auto p-8";

const RecorderControl = () => {
  const { id } = useParams();
  const [recorder, setRecorder] = useState<Recorder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { height } = useWindowDimensions();
  const { showConfirmationModal } = useContext(ConfirmationModalContext);

  useEffect(() => {
    if (id)
      listenForRecorder(id, setRecorder).then(setRecorder).catch(setError);
  }, [id]);

  const validItemId = useMemo(() => {
    if (!recorder?.item) return false;
    return (
      recorder.item.match(iQRFormatRegex) ||
      recorder.item.match(iQRLegacyFormatRegex)
    );
  }, [recorder]);

  const orderId = useMemo(() => {
    if (!(recorder?.item && validItemId)) return "";
    const orderIdInternal = getOrderFromItem(recorder.item);
    return orderIdInternal;
  }, [recorder, validItemId]);

  const setItem = (item: string) => {
    if (id) setRecorderItem(id, item);
  };

  // Input Validation

  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (validItemId) {
      setShowValidation(false);
    }
  }, [validItemId]);

  const errorBorder = useMemo(
    () => (showValidation && !validItemId ? "border-error" : ""),
    [showValidation, validItemId]
  );

  // Buttons

  const startClick = () =>
    recorder && user?.email && startRecording(recorder, user.email);

  const stopClick = () =>
    recorder && user?.email && stopRecording(recorder, user.email);

  const resetClick = () => id && resetRecording(id);

  const iQRClick = () => navigate("link-item");

  const clearItem = () => setItem("");

  const orderDetailsClick = () => {
    if (orderId.match(oQRFormatRegex)) navigate(`/order/${orderId}`);
    if (orderId.match(oQRLegacyFormatRegex))
      window.location.href = `${legacyAppUrl}/orders/${orderId}`;
  };

  const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (id) setRecorderName(id, e.target.value);
  };

  const resetName = () => {
    if (id) setRecorderName(id, "");
  };

  const deleteThisRecorder = () =>
    showConfirmationModal(
      "Delete recorder",
      "Are you sure you want to delete this recorder?",
      () => {
        if (id) {
          deleteRecorder(id);
          navigate("/recording");
        }
      }
    );

  // Rendering

  if (error) {
    return <div className="p-3">{error}</div>;
  }

  if (!recorder) {
    return <LoadingSpinnerFull />;
  }

  return (
    <div className="h-full">
      <div className="flex flex-col h-full justify-between p-4">
        <div
          id="recorder-info-panel"
          className={`mb-2 py-2 ${styles.mdPadding} ${styles.floatingElement}`}
        >
          <div id="recorder-name-row" className="w-full p-3">
            <span className="inline-flex justify-center w-full text-xl ">
              <span className="mr-1">Recorder:</span>
              <span className="font-bold">{recorder.ip}</span>
            </span>
          </div>

          <div
            id="name-row"
            className="inline-flex items-baseline justify-between w-full p-3"
          >
            <span className="mr-3">Name:</span>
            <div className="w-52 inline-flex">
              <label
                className={`grow flex items-center justify-between input input-bordered`}
              >
                <input
                  type="text"
                  value={recorder.name || ""}
                  onChange={setName}
                  className="w-full pr-2"
                />
                {recorder?.item && (
                  <FaCircleXmark onClick={resetName} className="opacity-60" />
                )}
              </label>
            </div>
          </div>

          <div
            id="item-row"
            className="inline-flex items-baseline justify-between w-full p-3"
          >
            <span className="mr-3">Item:</span>
            <div className="w-52 inline-flex">
              <label
                className={`grow flex items-center justify-between input input-bordered border-r-0 rounded-r-none  ${errorBorder}`}
              >
                <input
                  type="text"
                  value={recorder.item || ""}
                  onChange={(e) => setItem(e.target.value)}
                  onBlur={() => setShowValidation(true)}
                  className="w-full pr-2"
                />
                {recorder?.item && (
                  <FaCircleXmark onClick={clearItem} className="opacity-60" />
                )}
              </label>

              <button
                className={`btn btn-info input-bordered p-2 border-l-0 rounded-l-none ${errorBorder}`}
              >
                <FaQrcode onClick={iQRClick} className="text-3xl" />
              </button>
            </div>
          </div>

          <div
            id="order-id-row"
            className={`w-full p-3 ${!orderId && "opacity-70"}`}
          >
            <div className="w-full inline-flex items-baseline justify-between">
              <span>Order Details:</span>
              {
                <button
                  onClick={orderDetailsClick}
                  className="btn btn-info"
                  disabled={!orderId}
                >
                  {!orderId ? "None" : validItemId ? orderId : "Invalid item"}
                </button>
              }
            </div>
          </div>
        </div>

        {height > 720 && (
          <div
            className={`grow flex justify-center items-center p-auto ${styles.mdPadding} `}
          >
            <TapeRecorder turning={false} />
          </div>
        )}

        <div
          className={`mt-2 p-8 ${styles.mdPadding} ${styles.floatingElement}`}
        >
          <div className="flex justify-around sm:justify-between">
            {!recorder.recording ? (
              <button
                onClick={startClick}
                className={`${recordingCtrlBtn} btn-error rounded-full`}
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopClick}
                className={`${recordingCtrlBtn} btn-error`}
              >
                Stop
              </button>
            )}
            <button
              onClick={resetClick}
              className={`${recordingCtrlBtn} btn-neutral`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="w-full inline-flex justify-center">
          <button
            onClick={deleteThisRecorder}
            className={`btn btn-error mt-2 rounded-full`}
          >
            <FaTrash />
            <span>Delete Recorder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default RecorderControl;

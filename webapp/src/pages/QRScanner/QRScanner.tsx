import useWindowDimensions from "@/context/useWindowDimensions.ts";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/../tailwind.config.ts";
import {
  convertRemToPixels,
  getOrderIdFromLabLineId,
  isPrevStatus,
  addRecorder,
  addLabLine,
  getOrderOnce,
  listenForOrder,
  updateOrderStatus,
  getRecorderByIp,
  getIndexFromIp,
} from "utils";
import { useContext, useEffect, useState } from "react";
import IQRBatchTab from "./iQRBatchTab.tsx";
import OQRBatchTab from "./oQRBatchTab.tsx";
import { OrderStatus, SpecificMediaType, Order } from "types";
import LabLinesList from "../orders/LabLinesList.tsx";

import SpecificMediaTypePicker from "./SpecificMediaTypePicker.tsx";
import { useNavigate } from "react-router-dom";
import {
  EmailTriggerStatuses,
  ipAddressRegex,
  iQRFormatRegex,
  oQRFormatRegex,
} from "values";
import PulloutTab from "@/components/PulloutTab.tsx";
import FloatingIndicator from "@/components/FloatingIndicator.tsx";
import { ConfirmationModalContext } from "@/components/useConfirmationModal.tsx";
import StatusTransition from "@/components/StatusTransition.tsx";
import QRScannerComponent from "./QRScannerComponent.tsx";

const QRScanner = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [showConfirmTick, setShowConfirmTick] = useState(false);
  const [labLineId, setLabLineId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const [iQRTabOpen, setIQRTabOpen] = useState(false);
  const [batchSpecificMediaType, setBatchSpecificMediaType] =
    useState<SpecificMediaType | null>(null);
  const [oQRTabOpen, setOQRTabOpen] = useState(false);
  const [batchStatus, setBatchStatus] = useState<OrderStatus | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);

  const { width, height } = useWindowDimensions();
  const twConfig = resolveConfig(tailwindConfig);
  const paddingTop = convertRemToPixels(twConfig.theme.spacing[16]);
  const minScreenSize =
    Math.min(width, height) - (height < width ? paddingTop : 0);

  const addNewLabLine = async (
    order: Order,
    lab_line_id: string,
    specificMediaType: SpecificMediaType
  ) => {
    if (!(order && lab_line_id && specificMediaType)) return;
    await addLabLine(order, { id: lab_line_id, specificMediaType })
      .then(() => {
        setShowConfirmTick(true);
      })
      .catch((error: Error) => {
        alert(error.message || "Something went wrong.");
      });
  };

  const handleAddNewLabLine = (lab_line_id: string, passedOrder: Order) => {
    if (batchSpecificMediaType === null) {
      setLabLineId(lab_line_id);
      setPickerOpen(true);
    } else {
      addNewLabLine(passedOrder, lab_line_id, batchSpecificMediaType).then(
        () => {
          setLoading(false);
          setScanning(true);
        }
      );
    }
  };

  useEffect(() => {
    if (showConfirmTick) {
      setTimeout(() => {
        setShowConfirmTick(false);
      }, 1000);
    }
  }, [showConfirmTick]);

  const reset = () => {
    setLabLineId(null);
    setLoading(false);
    setScanning(true);
    setPickerOpen(false);
  };

  const { showConfirmationModal } = useContext(ConfirmationModalContext);

  const handleIQRScan = (lab_line_id: string) => {
    if (batchStatus) {
      alert(
        "Error: Currently in batch oQR mode, exit oQR batch mode to scan iQR codes."
      );
      setLoading(false);
      setScanning(true);
      return;
    }
    const scannedOrderId = getOrderIdFromLabLineId(lab_line_id);
    if (!order || order.id !== scannedOrderId) {
      listenForOrder(scannedOrderId, setOrder)
        .then((orderResult: Order) => {
          handleAddNewLabLine(lab_line_id, orderResult);
        })
        .catch(() => {
          alert(
            `Error: Order ${scannedOrderId} not found, make sure the Order exists in the database.`
          );
          reset();
        });
    } else {
      handleAddNewLabLine(lab_line_id, order);
    }
  };

  const handleOQRScan = async (orderId: string) => {
    const confirmChange = () => {
      if (batchStatus)
        updateOrderStatus(orderId, batchStatus)
          .then(() => {
            setShowConfirmTick(true);
          })
          .catch(() => {
            alert("Something went wrong.");
          })
          .finally(() => {
            reset();
          });
    };

    if (batchStatus === null) {
      navigate(`/order/${orderId}`);
    } else {
      const scannedOrder = await getOrderOnce(orderId);

      if (scannedOrder === null) {
        alert(
          `Error: Order ${orderId} not found, make sure the Order exists in the database.`
        );
      } else {
        if (isPrevStatus(scannedOrder.status, batchStatus)) {
          showConfirmationModal(
            "Change to previous status?",
            "You are about to change the status of this order to a previous step in the process, are you sure you awnt to make this change?",
            confirmChange,
            <StatusTransition
              oldStatus={scannedOrder?.status}
              newStatus={batchStatus}
            />,
            () => reset()
          );
        } else {
          confirmChange();
        }
      }
    }
  };

  const handleIpQRScan = async (ip: string) => {
    const recorderExists = await getRecorderByIp(ip);
    if (!recorderExists) {
      await addRecorder(ip);
    }
    navigate(`/recording/${getIndexFromIp(ip)}`);
  };

  const handleScan = (scanResult: string) => {
    if (!scanning) return;
    setLoading(true);
    setScanning(false);

    if (scanResult.match(iQRFormatRegex)) {
      handleIQRScan(scanResult);
    } else if (scanResult.match(oQRFormatRegex)) {
      handleOQRScan(scanResult);
    } else if (scanResult.match(ipAddressRegex)) {
      handleIpQRScan(scanResult);
    } else {
      alert(
        "Error: That QR code is not an oQR, iQR, or IP-QR: \n" +
          scanResult.slice(0, 32) +
          "..."
      );
      reset();
    }
  };

  const handleError = (result: string) => {
    console.log(result);
  };

  const handlePick = (specificMediaType: SpecificMediaType) => {
    if (order && labLineId) {
      addNewLabLine(order, labLineId, specificMediaType).then(() => {
        setPickerOpen(false);
        setLoading(false);
        setScanning(true);
      });
    }
  };

  const cancelPicker = () => {
    reset();
  };

  useEffect(() => {
    if (oQRTabOpen) setIQRTabOpen(false);
  }, [oQRTabOpen]);

  useEffect(() => {
    if (iQRTabOpen) setOQRTabOpen(false);
  }, [iQRTabOpen]);

  useEffect(() => {
    if (batchSpecificMediaType) {
      setIQRTabOpen(false);
      reset();
      setBatchStatus(null);
    }
  }, [batchSpecificMediaType]);

  useEffect(() => {
    if (batchStatus) {
      if (EmailTriggerStatuses.includes(batchStatus)) {
        alert(
          `You're now in batch mode, changing statuses to ${batchStatus}. Scanning oQRs will change the order status and trigger an email to be sent to the customer.`
        );
      }
      setOQRTabOpen(false);
      reset();
      setOrder(null);
    }
  }, [batchStatus]);

  return (
    <>
      <div className="flex flex-col">
        <QRScannerComponent
          handleScan={handleScan}
          handleError={handleError}
          loading={loading}
          showConfirmTick={showConfirmTick}
        >
          <FloatingIndicator
            show={!!batchSpecificMediaType}
            position="bottom"
            cancel={() => setBatchSpecificMediaType(null)}
          >
            Scanning: {batchSpecificMediaType}
          </FloatingIndicator>

          <FloatingIndicator
            show={!!batchStatus}
            position="bottom"
            cancel={() => setBatchStatus(null)}
          >
            Updating Status: {batchStatus}
          </FloatingIndicator>

          <FloatingIndicator
            show={!!order?.id}
            position="top"
            cancel={() => setOrder(null)}
          >
            <span>Order: {order?.id}</span>
          </FloatingIndicator>
        </QRScannerComponent>

        <div
          style={{ height: height - minScreenSize - paddingTop }}
          className="flex flex-row w-full overflow-y-scroll border-t-2 border-base-300"
        >
          <table className="table table-zebra table-pin-rows table-sm max-h-full w-full">
            <tbody>
              {order && <LabLinesList order={order ?? null} reverse={true} />}
            </tbody>
          </table>
        </div>

        <PulloutTab
          tabTitle="iQR Batch"
          open={iQRTabOpen}
          setOpen={setIQRTabOpen}
          height={228}
          left={"25%"}
        >
          <IQRBatchTab
            value={batchSpecificMediaType}
            onChange={setBatchSpecificMediaType}
          />
        </PulloutTab>

        <PulloutTab
          tabTitle="oQR Batch"
          open={oQRTabOpen}
          setOpen={setOQRTabOpen}
          height={437}
          right={"25%"}
        >
          <OQRBatchTab
            value={batchStatus}
            onChange={setBatchStatus}
            width={"133px"}
          />
        </PulloutTab>
      </div>

      {pickerOpen && (
        <SpecificMediaTypePicker
          handlePick={handlePick}
          handleExitClick={cancelPicker}
        />
      )}
    </>
  );
};
export default QRScanner;

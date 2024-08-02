import { useNavigate, useParams } from "react-router-dom";
import QRScannerComponent from "../QRScanner/QRScannerComponent";
import { iQRFormatRegex, iQRLegacyFormatRegex } from "@/values";
import { setRecorderItem } from "@/utils";
import { useState } from "react";

const RecorderiQRScanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleScan = async (data: string): Promise<void> => {
    setLoading(true);
    if (
      id &&
      (data.match(iQRFormatRegex) || data.match(iQRLegacyFormatRegex))
    ) {
      await setRecorderItem(id, data);
      navigate(`/recording/${id}`);
    } else {
      alert("Invalid iQR code");
      setLoading(false);
    }
  };

  const handleError = async (error: string): Promise<void> => {
    console.error(error);
    alert("something went wrong");
  };

  return (
    <>
      <div className="flex flex-col">
        <QRScannerComponent
          handleScan={handleScan}
          handleError={handleError}
          loading={loading}
        />
      </div>
    </>
  );
};
export default RecorderiQRScanner;

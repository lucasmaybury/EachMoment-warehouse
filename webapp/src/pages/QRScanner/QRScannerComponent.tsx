import useWindowDimensions from "@/context/useWindowDimensions";
import { convertRemToPixels } from "@/utils";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { FaCheckCircle } from "react-icons/fa";
import tailwindConfig from "../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import LoadingSpinnerFull from "@/components/LoadingSpinnerFull";

type Props = {
  handleScan: (data: string) => void;
  handleError: (error: string) => void;
  loading: boolean;
  showConfirmTick?: boolean;
  children?: React.ReactNode;
};

const QRScannerComponent = ({
  handleScan,
  handleError,
  loading,
  showConfirmTick = false,
  children,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const twConfig = resolveConfig(tailwindConfig);
  const paddingTop = convertRemToPixels(twConfig.theme.spacing[16]);
  const minScreenSize =
    Math.min(width, height) - (height < width ? paddingTop : 0);

  return (
    <div className="relative pt-16">
      <div className="relative">
        <QrScanner
          containerStyle={{
            paddingTop: 0,
            ...{
              width: minScreenSize,
              height: minScreenSize,
            },
          }}
          onDecode={handleScan}
          onError={handleError}
        />

        {loading && (
          <div className="absolute top-0 h-full w-full z-50 flex justify-center items-center">
            <span className="z-[51] opacity-50">
              <LoadingSpinnerFull />
            </span>
            <div className="absolute bg-black opacity-70 w-full h-full" />
          </div>
        )}

        <div
          className={`
                ${!showConfirmTick && "hidden"} 
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
              `}
        >
          <FaCheckCircle className="text-[8rem] opacity-50 text-green-500" />
        </div>

        {children}
      </div>
    </div>
  );
};

export default QRScannerComponent;

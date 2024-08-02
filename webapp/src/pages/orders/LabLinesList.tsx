import { FaTrash } from "react-icons/fa6";
import { removeLabLine } from "../../utils/orderHelpers";
import { Order } from "types";

type LabLinesListProps = { order: Order; reverse?: boolean };

const LabLinesList = ({ order, reverse = false }: LabLinesListProps) => {
  if (!order.lab_lines) return <></>;
  const lab_lines = reverse ? [...order.lab_lines]?.reverse() : order.lab_lines;
  return (
    <>
      {lab_lines?.map((item, index) => (
        <tr key={index} className="h-10 w-full">
          <td className="w-fit">
            <span className="pl-4 text-md">{item.id}</span>
          </td>
          <td>
            <span className="pl-4 text-md">{item.specificMediaType}</span>
          </td>
          <td>
            <button
              onClick={() => removeLabLine(order, item.id)}
              className="btn float-end border border-gray-300 w-fit mr-1 bg-red-300"
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
      <tr style={{ height: "auto" }} />
    </>
  );
};
export default LabLinesList;

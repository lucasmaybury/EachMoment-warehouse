import { useEffect, useMemo, useState } from "react";
import { Order, LabLine } from "types";
import { getNextAvailableId } from "../../utils/utils";
import { addLabLine } from "../../utils/orderHelpers";
import { FaPlusCircle } from "react-icons/fa";
import { SpecificMediaType } from "types";
import { SpecificMediaTypes } from "@/values";
import LabLinesList from "./LabLinesList";

const LabLinesSection = ({ order }: { order: Order }) => {
  const [newId, setNewId] = useState<string>("");
  const [newSpecificMediaType, setNewSpecificMediaType] = useState<
    SpecificMediaType | ""
  >("");

  const newLabLineId = useMemo(() => {
    return `${order.id}-${newId}`;
  }, [order.id, newId]);

  useEffect(() => {
    setNewId(
      getNextAvailableId(
        order?.lab_lines
          ?.filter((i) => i.id.match(/[A-Z][A-Z]-\d\d\d\d-\d+/))
          .map((i) => i.id.split("-")[2]) ?? []
      )
    );
  }, [order]);

  const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = (e.target as HTMLInputElement).value;
    setNewId(newId);
  };

  const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpecificMediaType = (e.target as HTMLSelectElement).value;
    setNewSpecificMediaType((newSpecificMediaType as SpecificMediaType) || "");
  };

  const handleAddButtonClick = () => {
    addLabLine(order, {
      id: newLabLineId,
      specificMediaType: newSpecificMediaType,
    } as LabLine).catch((error: Error) => {
      alert(error.message || "Something went wrong.");
    });
  };

  return (
    <div className="bg-white border border-gray-300">
      <div className="flex justify-center w-full overflow-y-scroll overflow-x-hidden h-96">
        <table className="table table-zebra table-pin-rows table-sm max-h-full max-w-full">
          <tbody>
            <LabLinesList order={order} />
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td className="p-2">
                <label className="input input-bordered min-w-32 flex items-center px-3">
                  <span>{order.id}-</span>
                  <input
                    type="text"
                    onChange={handleIdInputChange}
                    value={newId}
                    className="w-5"
                  />
                </label>
              </td>
              <td className="p-2">
                <select
                  value={newSpecificMediaType}
                  onChange={handleMediaTypeChange}
                  className="select border min-w-24 border-gray-300 w-full px-3"
                >
                  <option value="">Select...</option>
                  {SpecificMediaTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={handleAddButtonClick}
                  disabled={!(!!newId && !!newSpecificMediaType)}
                  className="btn float-end border-gray-300 w-fit bg-green-300 mr-1"
                >
                  <FaPlusCircle />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default LabLinesSection;

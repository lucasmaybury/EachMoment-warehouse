import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useDropdown from "../../components/useDropdown";
dayjs.extend(utc);
import { FaPlusCircle } from "react-icons/fa";
import { CDL, Order } from "types";
import { useState } from "react";
import Dropdown from "../../components/Dropdown";
import ExpanderIcon from "../../components/ExpanderIcon";
import { removeCDL, writeOrderData } from "../../utils/orderHelpers";
import { FaTrash } from "react-icons/fa6";

type CDLEditorProps = {
  order: Order;
};

const CDLEditor = ({ order }: CDLEditorProps) => {
  const { isOpen, setIsOpen } = useDropdown(false);
  const [note, setNote] = useState(order.CDL?.note || "");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    order.CDL?.date ? new Date(order.CDL.date) : null
  );
  const [dateError, setDateError] = useState("");
  const [noteError, setNoteError] = useState("");

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
    setNoteError("");
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setDateError("");
  };

  const updateOrderCDL = (newCDL: CDL) => {
    order.CDL = newCDL;
    writeOrderData(order);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || selectedDate <= new Date()) {
      setDateError("Please select a future date");
    }
    if (!note) {
      setNoteError("Please enter a note");
    }
    if (selectedDate && selectedDate > new Date() && note) {
      updateOrderCDL({
        date: selectedDate.toISOString(),
        note: note,
      });
      setIsOpen(false);
    }
  };

  const handleRemoveCDL = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    removeCDL(order);
    setIsOpen(false);
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        setOpen={setIsOpen}
        display={
          <>
            <div
              className={`badge bg-info  text-base-100 border-2 ${
                order.CDL ? "" : "opacity-60 border-blue-500"
              } `}
            >
              <div className={`flex flex-row items-center justify-between`}>
                <span className="mr-1">CDL</span>
                {order.CDL ? (
                  <ExpanderIcon isOpen={isOpen} />
                ) : (
                  <FaPlusCircle className="my-auto" />
                )}
              </div>
            </div>
          </>
        }
        dropdown={
          <div className="dropdown-content z-9 shadow-lg rounded-box max-md:-left-1/2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center p-3 bg-gray-100 border-2 border-gray-300 rounded-lg "
            >
              <div className="form-control p-2 w-full flex justify-start">
                <label className="input-group">
                  <span>Date:</span>
                </label>
                <input
                  type="date"
                  value={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                  }
                  onChange={(event) =>
                    handleDateChange(new Date(event.target.value))
                  }
                  className={`input input-bordered w-full p-2 ${
                    dateError ? "border-red-500" : ""
                  }`}
                />
                {dateError && <p className="text-red-500">{dateError}</p>}
              </div>

              <div className="form-control p-2">
                <label className="input-group">
                  <span>Note:</span>
                </label>
                <textarea
                  value={note}
                  onChange={handleNoteChange}
                  className={`input input-bordered h-24 ${
                    noteError ? "border-red-500" : ""
                  }`}
                />
                {noteError && <p className="text-red-500">{noteError}</p>}
              </div>

              <div className="form-control w-full flex flex-row items-center justify-between p-2">
                <button className="btn btn-info">Set CDL</button>
                <button onClick={handleRemoveCDL} className="btn text-error">
                  <FaTrash className="my-auto" />
                </button>
              </div>
            </form>
          </div>
        }
      />
    </>
  );
};
export default CDLEditor;

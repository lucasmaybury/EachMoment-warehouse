import { useState } from "react";
import { Order } from "types";
import { writeOrderData } from "../../utils/orderHelpers";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useWindowDimensions from "@/context/useWindowDimensions";

type FieldsType = "scanning_comments" | "qc_comments" | "comments";
const fields = ["scanning_comments", "qc_comments", "comments"] as FieldsType[];
const tabLabels = ["Scanning", "QC", "General"];

const CommentsSection = ({ order }: { order: Order }) => {
  const auth = useAuth();
  const screenSize = useWindowDimensions();
  const [message, setMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleMessageInputEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") addComment();
  };

  const addComment = () => {
    const commentsField = fields[activeTab];

    const newComment = {
      timestamp: new Date().toISOString(),
      email: auth.user?.email ?? "unknown",
      message: message,
    };

    writeOrderData({
      ...order,
      [commentsField]: [newComment, ...(order[commentsField] ?? [])],
    });

    setMessage("");
  };

  const removeComment = (
    commentsField: string,
    timestamp: string,
    email: string
  ) => {
    writeOrderData({
      ...order,
      [commentsField]: order[commentsField as FieldsType].filter(
        (comment) =>
          `${comment.email}-${comment.timestamp}` !== `${email}-${timestamp}`
      ),
    });
  };

  const getCommentCountClass = (count: number) => {
    return count === 0 ? "bg-green-300" : "bg-red-300";
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white border border-gray-300">
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex border-b border-gray-300">
          {tabLabels.map((label, index) => (
            <Tab
              key={index}
              className={`cursor-pointer px-4 py-2 text-gray-600 rounded-t-lg transition duration-300 ease-in-out ${
                activeTab === index
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {label}{" "}
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-sm text-white rounded-full ml-2 ${getCommentCountClass(
                  (order[fields[index]] ?? []).length
                )}`}
              >
                {(order[fields[index]] ?? []).length}
              </span>
            </Tab>
          ))}
        </TabList>

        {fields.map((commentsField, index) => (
          <TabPanel key={index}>
            <div className="w-full h-96 overflow-y-scroll">
              <table className="table table-zebra table-pin-rows table-fixed table-sm h-full">
                <tbody className="h-full">
                  {(order[commentsField] ?? []).map((comment, index) => (
                    <tr key={index} className="h-10 w-full">
                      <td className="w-[99%] break-words">
                        <div className="flex flex-col">
                          <span className="w-fit ml-1 text-sm text-gray-400">
                            {comment.email}
                            {screenSize.width > 550 ? " - " : <br />}
                            {formatDate(comment.timestamp)}
                          </span>
                          <span className="pl-4 text-md break-words">
                            {comment.message}
                          </span>
                        </div>
                      </td>
                      <td className="w-16">
                        <button
                          onClick={() =>
                            removeComment(
                              commentsField,
                              comment.timestamp,
                              comment.email
                            )
                          }
                          className="btn float-end border border-gray-300 bg-red-300"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="h-auto w-full"></tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan={2}>
                      <div className="flex flex-row">
                        <input
                          type="text"
                          onChange={handleMessageInputChange}
                          value={message}
                          className="input input-bordered w-full"
                          onKeyDown={handleMessageInputEnter}
                        />
                        <button
                          onClick={addComment}
                          className="btn ml-2 border-gray-300 bg-green-300"
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default CommentsSection;

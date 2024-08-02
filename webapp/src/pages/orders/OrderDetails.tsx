import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Order } from "types";
import { listenForOrder } from "../../utils/orderHelpers";
import Field from "./Field";
import dayjs from "dayjs";
import StatusDropdown from "./StatusDropdown";
import LabLinesSection from "./LabLinesSection";
import CommentsSection from "./CommentsSection";
import CDLEditor from "./CDLEditor";
import ExpanderIcon from "../../components/ExpanderIcon";
import ButtonsSection from "./printerButtons/ButtonsSection";
import InvoiceSection from "./InvoiceSection";
import CameraNavButton from "../QRScanner/CameraNavButton";
import { EmailTriggerStatuses } from "@/values";
import { FaEnvelopeCircleCheck as EmailSentIcon } from "react-icons/fa6";
import StatusBadge from "@/components/StatusBadge";
import {
  dispatchedStatusPrinting,
  emailTrackerName,
  returnDispatchedStatusPrinting,
} from "@/utils";
import { ConfirmationModalContext } from "@/components/useConfirmationModal";

import LoadingSpinnerFull from "@/components/LoadingSpinnerFull";

const sectionClasses =
  "flex flex-col p-3 my-2 overflow-visible border-2 border-gray-200 rounded-lg bg-gray-100";
const titleClasses = "text-lg mx-auto mb-4 font-bold";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const toggleAddressVisibility = () => setIsAddressVisible(!isAddressVisible);

  const { showConfirmationModal } = useContext(ConfirmationModalContext);

  useEffect(() => {
    if (id) listenForOrder(id, setOrder);
  }, [id]);

  useEffect(() => {
    if (renderCount <= 1) {
      setRenderCount(renderCount + 1);
      return;
    }
    switch (order?.status) {
      case "[MB] Dispatched":
        showConfirmationModal(
          "Print documents?",
          "Would you like to print the oQR, iQRs and Name-it Sheet for this order?",
          () => dispatchedStatusPrinting(order)
        );

        break;
      case "[MB] Return Dispatched":
        showConfirmationModal(
          "Print documents?",
          "Would you like to print the Lab Report for this order?",
          () => returnDispatchedStatusPrinting(order)
        );
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.status]);

  if (!order) return <LoadingSpinnerFull />;

  return (
    <>
      <div className="pt-2 px-4 pb-20">
        <div className={`sticky top-[55px] z-10 ${sectionClasses}`}>
          <div className="flex flex-row justify-between items-center p-1">
            <span className="flex flex-col items-center p-1 text-center">
              <span className="text-lg max-sm:font-bold">Order:</span>
              <span className="font-bold text-lg sm:text-2xl">{order.id}</span>
            </span>
            <CDLEditor order={order} />
            <StatusDropdown order={order} />
          </div>
        </div>

        <div className={`${sectionClasses}`}>
          <h2 className={`${titleClasses}`}>Order Details</h2>
          <Field label={"Email:"} value={order.customer_info.email} />
          <Field label={"Phone:"} value={order.customer_info.phone} />
          <Field
            label={"Created:"}
            value={dayjs(order.order_details.created_at).format(
              "ddd DD/MM/YYYY"
            )}
          />
          <Field label={"Note:"} value={order.order_details.note ?? ""} />
          {order.memory_boxes && order.memory_boxes.length > 0 && (
            <>
              <Field label={"Memory Box:"}>
                <div className="bg-white p-2 rounded-lg">
                  {order.memory_boxes.map((item, index) => (
                    <div key={`memory-${index}`}>{item.title}</div>
                  ))}
                </div>
              </Field>
            </>
          )}

          <Field label={"Output Format:"}>
            <div className="bg-white p-2 rounded-lg">
              {order.output_formats?.map((item, index) => (
                <div key={`output-${index}`}>
                  {item.title} x {item.quantity ?? 1}
                </div>
              )) ?? "Not provided"}
            </div>
          </Field>

          <div className="m-2">
            <span
              className="cursor-pointer flex flex-row align-middle"
              onClick={toggleAddressVisibility}
            >
              Delivery Address
              <span className="ml-2 my-auto">
                <ExpanderIcon isOpen={isAddressVisible} />
              </span>
            </span>
            {isAddressVisible && (
              <div className="flex flex-col mt-2 bg-white p-2 rounded-lg">
                {Object.values(order.customer_info.shipping_address).map(
                  (line, index) => (
                    <div key={index}>{line}</div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:inline-flex">
          <div className={`${sectionClasses}`}>
            <h2 className={`${titleClasses}`}>Emails Sent</h2>
            <div className="flex flex-wrap justify-center">
              {order.emails_sent ? (
                EmailTriggerStatuses.map((status, index) => (
                  <div
                    key={index}
                    className="flex flex-row w-full justify-around m-1 p-3 rounded-lg bg-base-100 sm:justify-center sm:w-fit"
                  >
                    <StatusBadge status={status} />
                    <div
                      className={`
                    rounded-full p-2 ml-3 ${
                      order.emails_sent![
                        emailTrackerName(
                          status
                        ) as keyof typeof order.emails_sent
                      ]
                        ? "bg-green-400 text-gray-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    >
                      <EmailSentIcon className="text-3xl translate-x-[2.5px]" />
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <span>No emails sent yet</span>
                </div>
              )}
            </div>
          </div>
          {order.received_date && (
            <div
              className={`${sectionClasses} lg:ml-4 lg:w-96 lg:justify-center`}
            >
              <h2 className={`${titleClasses}`}>Received Date:</h2>
              <div className="flex flex-wrap justify-center text-center">
                {new Date(order.received_date)?.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) ?? ""}
              </div>
            </div>
          )}{" "}
        </div>

        {order.lab === "UK" && (
          <InvoiceSection
            order={order}
            sectionClasses={sectionClasses}
            titleClasses={titleClasses}
          />
        )}

        <div className={`${sectionClasses}`}>
          <h2 className={`${titleClasses}`}>Printing</h2>
          <ButtonsSection order={order} />
        </div>

        <div className={`${sectionClasses}`}>
          <h2 className={`${titleClasses}`}>Comments</h2>
          <CommentsSection order={order} />
        </div>

        <div className={`${sectionClasses}`}>
          <h2 className={`${titleClasses}`}>Lab Items</h2>
          <LabLinesSection order={order} />
        </div>
      </div>

      <CameraNavButton />
    </>
  );
};
export default OrderDetails;

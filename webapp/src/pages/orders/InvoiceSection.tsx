import { Order } from "types";
import Field from "./Field";
import { functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { useState, useEffect } from "react";
import HoverTooltip from "@/components/HoverTooltip";

type InvoiceSectionProps = {
  order: Order;
  sectionClasses: string;
  titleClasses: string;
};

type ExtraItemsCostRequest = { id: string };
type ExtraItemsCostResponse = {
  count: number;
  included: number;
  cost: number;
};

const InvoiceSection = ({
  order,
  sectionClasses,
  titleClasses,
}: InvoiceSectionProps) => {
  const [totalLabLines, setTotalLabLines] = useState(0);
  const [memBoxIncludedItems, setMemBoxIncludedItems] = useState(0);
  const [totalExtraCost, setTotalExtraCost] = useState(0);

  useEffect(() => {
    httpsCallable<ExtraItemsCostRequest, ExtraItemsCostResponse>(
      functions,
      "getExtraCost"
    )({ id: order.id }).then((result) => {
      setTotalLabLines(result.data.count);
      setMemBoxIncludedItems(result.data.included);
      setTotalExtraCost(result.data.cost);
    });
  }, [order, order.lab_lines, order.memory_boxes]);

  const [isButtonActive, setIsButtonActive] = useState(false);
  useEffect(() => {
    setIsButtonActive(totalLabLines > memBoxIncludedItems);
  }, [totalLabLines, memBoxIncludedItems, order.lab]);

  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const sendInvoiceHandler = () => {
    if (order.invoice_sent) return;
    console.log("Sending invoice");
    setInvoiceLoading(true);
    setIsButtonActive(false);
    sendInvoice()
      .then(() => {
        alert("Invoice sent successfully");
      })
      .catch(() => {
        alert("Failed to send invoice");
      })
      .finally(() => {
        setInvoiceLoading(false);
        setIsButtonActive(true);
      });
  };

  const sendInvoice = async () => {
    await httpsCallable(
      functions,
      "sendInvoice"
    )({ orderId: order.id }).then((result) => {
      console.log(result);
    });
  };

  return (
    <div className={`${sectionClasses}`}>
      <h2 className={`inline-flex items-start h-8 ${titleClasses}`}>
        <span className="my-auto mr-2">Extra Item Invoice</span>
        {isButtonActive && !order.invoice_sent && (
          <HoverTooltip
            source={
              <div className="h-8 inline-flex items-center">
                <div
                  className={`badge badge-indicator badge-sm bg-red-400 h-4`}
                />
              </div>
            }
            tooltip={
              <div className="flex flex-col py-1 font-normal text-sm">
                This order contains extra items and needs to be invoiced for
              </div>
            }
          />
        )}
      </h2>
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center justify-between w-100 mb-4 md:mb-0">
            <Field label={"Total Lab Items:"} value={totalLabLines} />
            <Field label={"Included Items:"} value={memBoxIncludedItems} />
            <Field
              label={"Extra Item Invoice:"}
              value={`£${totalExtraCost.toFixed(2)}`}
            />
          </div>
          <button
            className={`btn btn-info m-auto`}
            disabled={order.invoice_sent || !isButtonActive}
            onClick={sendInvoiceHandler}
          >
            Invoice for Extra Items
            {invoiceLoading && (
              <span className="loading loading-spinner"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSection;

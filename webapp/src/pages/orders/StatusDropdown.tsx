// Import DefaultOrderStatus
import { OrderStatus } from "types";
import { DefaultOrderStatus, EmailTriggerStatuses } from "@/values";
import StatusBadge from "@/components/StatusBadge";
import Dropdown from "@/components/Dropdown";
import useDropdown from "@/components/useDropdown";
import { Order } from "types";
import { writeOrderData } from "@/utils/orderHelpers";
import OrderStatusList from "@/components/OrderStatusList";
import { useContext } from "react";
import { emailTrackerName, isPrevStatus } from "utils";
import { ConfirmationModalContext } from "@/components/useConfirmationModal";
import StatusTransition from "@/components/StatusTransition";

type StatusDropdownProps = {
  order: Order;
};

const StatusDropdown = ({ order }: StatusDropdownProps) => {
  const { showConfirmationModal, hideConfirmationModal } = useContext(
    ConfirmationModalContext
  );

  const { isOpen, setIsOpen } = useDropdown();

  const updateOrderStatus = (newStatus: OrderStatus) => {
    if (order) {
      order.status = newStatus;
      writeOrderData(order);
    }
  };

  const confirmChange = (newStatus: OrderStatus) => {
    updateOrderStatus(newStatus);
    hideConfirmationModal();
    setIsOpen(false);
  };

  const checkEmailSend = (newStatus: OrderStatus) => {
    const alreadySent = order.emails_sent
      ? order.emails_sent[
          emailTrackerName(newStatus) as keyof typeof order.emails_sent
        ]
      : false;

    if (EmailTriggerStatuses.includes(newStatus) && !alreadySent) {
      setTimeout(() => {
        showConfirmationModal(
          "Change status and send email?",
          "Changing this status will send an email to the customer. Are you sure you want to make this change?",
          () => confirmChange(newStatus)
        );
      }, 1);
    } else {
      confirmChange(newStatus);
    }
  };

  const handleClick = (newStatus: OrderStatus) => {
    if (isPrevStatus(order.status, newStatus)) {
      showConfirmationModal(
        "Change to previous status?",
        "You are about to change the status of this order to a previous step in the process, are you sure you want to make this change?",
        () => checkEmailSend(newStatus),
        <StatusTransition oldStatus={order.status} newStatus={newStatus} />
      );
    } else {
      checkEmailSend(newStatus);
    }
  };

  // Ensure order has a default status if none is set
  const effectiveStatus = order.status || DefaultOrderStatus;

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        setOpen={setIsOpen}
        display={<StatusBadge status={effectiveStatus} />}
        dropdown={
          <div className="dropdown-content bg-base-100 border-2 border-base-300 rounded-box p-2 shadow-square-md">
            <div className="max-h-96 overflow-y-scroll shadow-inner">
              <OrderStatusList handleClick={handleClick} />
            </div>
          </div>
        }
      />
    </>
  );
};

export default StatusDropdown;

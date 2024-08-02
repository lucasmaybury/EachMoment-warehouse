import { EmailTriggerStatuses, OrderStatuses } from "values";

export type OrderStatus = (typeof OrderStatuses)[number];
export type EmailTriggerStatusType = (typeof EmailTriggerStatuses)[number];

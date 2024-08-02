import { Address } from "./Address";
import { OrderStatus } from "./OrderStatus";
import { LabLine } from "./LabLine";
import { LineItem } from "./LineItem";
import { OrderComment } from "./OrderComment";

export type CDL = {
  date: string;
  note: string;
};

export type MediaTypeCounts = {
  cine: number;
  av: number;
  photo: number;
};

type CustomerInfo = {
  billing_address: Address;
  customer_id: number;
  email: string;
  phone: string;
  shipping_address: Address;
};

type OrderDetails = {
  created_at: Date;
  currency: string;
  note: string | null;
  subtotal_price: string;
  tags: string[];
  total_price: string;
};

type EmailsSent = {
  Dispatched: boolean;
  Received: boolean;
  Restoration: boolean;
  Digitisation: boolean;
  Quality_Control: boolean;
  Finalising: boolean;
  Return_Dispatched: boolean;
};

export type Order = {
  id: string;
  lab: string;
  status: OrderStatus;
  customer_info: CustomerInfo;
  CDL?: CDL;
  memory_boxes: LineItem[];
  output_formats: LineItem[];
  lab_lines: LabLine[];
  media_type_counts: MediaTypeCounts;
  scanning_comments: OrderComment[];
  qc_comments: OrderComment[];
  comments: OrderComment[];
  order_details: OrderDetails;
  emails_sent?: EmailsSent;
  invoice_sent?: boolean;
  received_date?: Date;
};

export type Orders = Record<string, Order>;

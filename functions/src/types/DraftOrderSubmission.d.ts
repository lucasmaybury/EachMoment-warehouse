export type DraftOrderSubmission = {
  line_items: { variant_id: number; quantity: number }[];
  customer: { id: number };
  email: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    country: string;
    country_code: string;
    zip: string;
  };
  note: string;
};

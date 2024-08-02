import { logger } from "firebase-functions/v1";
import { Request } from "firebase-functions/v1/https";
import { Response } from "firebase-functions/v1";
import { addPdfUrlToDraftOrder, createDraftOrder } from "./createDraftOrder";
import { createPdf } from "./createPdf";
import { sendEmail } from "./sendEmail";
import {
  getCustomerByEmail,
  updateCustomerLocale,
  createCustomerFromQuote,
  uploadPdf,
  getRegionFromRequest,
} from "utils";
import { log } from "firebase-functions/logger";
import { externalRequest } from "../../middleware";

export const handleQuoteRequestFn = externalRequest(
  async (req: Request, res: Response): Promise<void> => {
    log("Starting function: handleQuoteRequest");

    let localeError = false;
    const locale = await getRegionFromRequest(req).catch(() => {
      localeError = true;
      return "GB";
    });

    const quote = {
      ...req.body,
      locale,
      note: `${localeError && "Error getting locale from quote request, defaulted to GB\n"}${req.body.note}`,
    };

    let customer = await getCustomerByEmail(quote.email);
    if (customer) {
      await updateCustomerLocale(customer, quote.locale);
    } else {
      customer = await createCustomerFromQuote(quote);
    }

    const draftOrder = await createDraftOrder(quote, customer.id);
    const { filename, pdf } = await createPdf(quote, draftOrder.invoice_url);
    const downloadURL = await uploadPdf("invoicePdfs", filename, pdf);
    log(`Download URL: ${downloadURL}`);
    await addPdfUrlToDraftOrder(draftOrder.id, downloadURL);

    // Modify the invoice URL
    let modifiedInvoiceUrl = draftOrder.invoice_url.replace(".co.uk", ".de");
    modifiedInvoiceUrl +=
      "?auto_redirect=false&edge_redirect=true&locale=de-DE&skip_shop_pay=true";

    res.json({
      invoice_url: modifiedInvoiceUrl,
    });

    const recipientEmails = [quote.email];
    sendEmail(recipientEmails, filename, pdf).catch((error) => {
      logger.error(error);
    });
  }
);

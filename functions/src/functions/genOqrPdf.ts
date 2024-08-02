import * as functions from "firebase-functions";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { formatDate, getOrder, uploadPdf } from "utils";
import { Order } from "types";
import { log } from "firebase-functions/logger";
import { defaultReceivedDate } from "values";
import { CallableContext } from "firebase-functions/v1/https";
import { verifyAuthToken } from "../auth";
// import fs from "fs";

type Params = { orderId: string };
type Result = {
  pdfUrl: string;
  filePath: string;
};

export const genOqrPdfFn = async (
  data: Params,
  context: CallableContext
): Promise<Result> => {
  verifyAuthToken(context);

  const orderId = data.orderId;

  log("Getting order:", orderId);
  const order = await getOrder(orderId);
  if (!order)
    throw new functions.https.HttpsError("not-found", "Order not found");

  const pdfBytes = await generatePdf(order);
  const fileName = `${order.id}.pdf`;
  const dir = "oqrPdfs";

  // For local testing
  // fs.writeFileSync(`./${fileName}`, pdfBytes);
  // return { pdfUrl: "", filePath: "" };

  const pdfUrl = await uploadPdf(dir, fileName, pdfBytes);

  return { pdfUrl, filePath: `${dir}/${fileName}` };
};

const generatePdf = async (order: Order) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([288, 432]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 50;
  const dateFontSize = 24;

  const shiftY = 70;

  const textInitialSpacer = 10;
  const textLineSpacer = 40;

  const textWidth = font.widthOfTextAtSize(order.id, fontSize);
  const textX = (page.getWidth() - textWidth) / 2;

  const qrCodeDataUrl = await QRCode.toDataURL(order.id, {
    errorCorrectionLevel: "H",
    width: 200,
    margin: 1,
  });
  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
  const qrCodeDims = qrCodeImage.scale(1);

  const qrBorderMargin = 10;
  const qrWidthWithBorder = qrCodeDims.width + 2 * qrBorderMargin;
  const qrHeightWithBorder = qrCodeDims.height + 2 * qrBorderMargin;
  const totalHeight = fontSize + qrHeightWithBorder + 30;

  const centerY = (page.getHeight() - totalHeight) / 2;
  const textY = centerY + qrHeightWithBorder + 20 + shiftY;
  const qrY = centerY + shiftY;
  const qrX = (page.getWidth() - qrWidthWithBorder) / 2;

  // Order ID
  page.drawText(order.id, {
    x: textX,
    y: textY,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Border
  page.drawRectangle({
    x: qrX,
    y: qrY,
    width: qrWidthWithBorder,
    height: qrHeightWithBorder,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // QR code
  page.drawImage(qrCodeImage, {
    x: qrX + qrBorderMargin,
    y: qrY + qrBorderMargin,
    width: qrCodeDims.width,
    height: qrCodeDims.height,
  });

  // Received date
  const receivedDate = formatDate(order?.received_date ?? defaultReceivedDate);
  const dateText = `Received: ${receivedDate}`;
  const dateWidth = font.widthOfTextAtSize(dateText, dateFontSize);
  const dateX = (page.getWidth() - dateWidth) / 2;
  const dateY = qrY - dateFontSize - textInitialSpacer;
  page.drawText(dateText, {
    x: dateX,
    y: dateY,
    size: dateFontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Rush Processing
  if (order.output_formats?.some((o) => o.title === "Rush Processing")) {
    const rushProcessText = "Rush Processing";
    const rushWidth = font.widthOfTextAtSize(rushProcessText, dateFontSize);
    const rushX = (page.getWidth() - rushWidth) / 2;
    const rushY = qrY - dateFontSize - textInitialSpacer - textLineSpacer;
    page.drawText(rushProcessText, {
      x: rushX,
      y: rushY,
      size: dateFontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  // CDL
  if (order.CDL) {
    const cdlDate = formatDate(order.CDL.date);
    const cdlText = `CDL: ${cdlDate}`;
    const cdlWidth = font.widthOfTextAtSize(cdlText, dateFontSize);
    const cdlX = (page.getWidth() - cdlWidth) / 2;
    const cdlY = qrY - dateFontSize - textInitialSpacer - textLineSpacer * 2;
    page.drawText(cdlText, {
      x: cdlX,
      y: cdlY,
      size: dateFontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};

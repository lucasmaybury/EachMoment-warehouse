import { Quote } from "types";
import {
  generateTableBody,
  calculateDiscountedTotal,
  generateOptionsTableBody,
} from "./pdfHelper";
import { mailConfig } from "values";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { log } from "firebase-functions/logger";

export const createPdf = async (quote: Quote, invoice_url: string) => {
  log("Creating PDF from quote");
  const config = mailConfig();

  const printer = new PdfPrinter(config.fonts);

  const filename = `Angebot_${quote.l_name}_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  const docDefinition = await generatePdfData(quote, invoice_url);

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks: Buffer[] = [];
  pdfDoc.on("data", (chunk) => chunks.push(chunk));

  const readPromise = new Promise<Buffer>((resolve) => {
    pdfDoc.on("end", async () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
  });
  pdfDoc.end();

  const result = await readPromise;
  log("PDF created successfully:", filename);
  return { filename, pdf: result };
};

const generatePdfData = async (
  quote: Quote,
  invoice_url: string
): Promise<TDocumentDefinitions> => ({
  content: [
    {
      image: "lib/media/logo.png",
      width: 150,
      alignment: "center",
    },
    {
      text: "Schleißheimer Str. 15, 85748 Garching bei München",
      style: "address",
      alignment: "center",
    },
    {
      table: {
        widths: ["*", 110],
        body: [
          [
            {
              stack: [
                { text: "\nKundendetails:\n", style: "subheader" },
                `Name: ${quote.f_name} ${quote.l_name}`,
                `Email: ${quote.email}`,
                `Telefonnummer: ${quote.Telefonnummer}`,
                `Adresse: ${quote.Adresse1} ${quote.Adresse2}, ${quote.Adresse3} ${quote.Adresse4}`,
              ],
              alignment: "left",
            },
            {
              stack: [
                { text: "Angebot", style: "header", alignment: "left" },
                {
                  text: new Date().toISOString(),
                  style: "date",
                },
              ],
              alignment: "right",
            },
          ],
        ],
      },
      layout: "noBorders",
    },
    {
      text: "Digitalisierungsprojekt:",
      style: "subheader",
    },
    {
      style: "tableExample",
      table: {
        widths: ["*", 50, 100, 100],
        headerRows: 1,
        body: [
          ["Artikel", "Menge", "Kosten pro Einheit", "Gesamtkosten"],
          ...generateTableBody(quote),
        ],
      },
      layout: "lightHorizontalLines",
    },
    {
      text: "Speichermedien Optionen:",
      style: "subheader",
    },
    {
      style: "optionsTable",
      table: {
        widths: ["*", 50, 100, 100],
        body: generateOptionsTableBody(quote),
      },
      layout: "lightHorizontalLines",
    },
    {
      text: "Versanddetails:",
      style: "subheader",
    },
    {
      style: "tableExample",
      table: {
        widths: ["*", 100],
        body: [
          [
            { text: "Vorgang", style: "tableHeader" },
            { text: "Gesamtkosten", style: "tableHeader" },
          ],
          [
            {
              text: "Senden Ihrer Erinnerungsbox an Sie.",
              style: "normalText",
            },
            { text: `${quote.shippingCost.toFixed(2)}€`, style: "normalText" },
          ],
          [
            {
              text: "Abholung Ihrer Erinnerungsbox (oder Abgabe an einem Abgabepunkt).",
              style: "normalText",
            },
            { text: "0€", style: "normalText" },
          ],
          [
            {
              text: "Rücksendung der vervollständigten Erinnerungsbox an Sie.",
              style: "normalText",
            },
            { text: "0€", style: "normalText" },
          ],
        ],
      },
      layout: "lightHorizontalLines",
    },
    {
      text: [
        { text: "Gesamtkosten vor Rabatt: ", style: "subtotal" },
        `${calculateDiscountedTotal(
          quote.outputDigitizationTotalCost,
          quote.discountAmount
        )}`,
      ],
    },
    {
      text: [
        { text: "Rabatt: ", style: "subtotal" },
        `${quote.discountAmount}%`,
      ],
    },
    {
      text: [
        { text: "Komplettpreis: ", style: "subtotal" },
        `${quote.finalTotalCost}`,
        " (inkl. 19% MwSt.)",
      ],
    },
    {
      text: [
        { text: "Rechnungs-URL: ", style: "subtotal" },
        {
          text: invoice_url,
          link: invoice_url,
          style: "invoiceUrl",
        },
      ],
    },
  ],
  styles: {
    header: {
      fontSize: 22,
      bold: true,
      margin: [0, 20, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    subtotal: {
      fontSize: 16,
      bold: true,
      margin: [0, 0, 0, 0],
    },
    address: {
      fontSize: 10,
      bold: false,
      margin: [0, 10, 0, 10],
    },
    date: {
      fontSize: 16,
      bold: true,
      margin: [0, 0, 0, 0],
      alignment: "left",
    },
    tableExample: {
      margin: [0, 5, 0, 15],
    },
    totalRow: {
      italics: true,
    },
    tableHeader: {
      bold: true,
    },
    invoiceUrl: {
      fontSize: 14,
      color: "blue",
      decoration: "underline",
    },
  },
});

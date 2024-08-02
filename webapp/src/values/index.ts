export const cdlHiglightDays = {
  danger: 2,
  warning: 5,
};

export const oQRFormatRegex = /^[A-Z]{2}-[0-9]{4}$/;
export const iQRFormatRegex = /^[A-Z]{2}-[0-9]{4}-[0-9]{2}$/;
export const ipAddressRegex = /^(\d{1,3}\.){3}\d{1,4}$/;
export const oQRLegacyFormatRegex = /^EM[0-9]{5}$/;
export const iQRLegacyFormatRegex = /^EM[0-9]{5}-[0-9]{2}$/;

export const oQRMatchRegex = /^[A-Z]{2}-[0-9]{4}/;
export const oQRLegacyMatchRegex = /^EM[0-9]{5}/;

export const cupsServerUrl = "https://192.168.1.245:3000/printers"; //"https://localhost:3003/printers";
export const iqrPrinterName = `Zebra_Technologies_ZTC_GX430d`;
export const oqrPrinterName = `Zebra_Technologies_ZTC_GK420d`;
export const mainPrinterName = `RICOH_Aficio_MP_C3002_EM_VPN`;

import NameItSheet from "./NameItSheet.txt";
export const nameItSheetString = NameItSheet;

export const recordingApiUrl = "https://lab.eachmoment.co.uk";
export const recordingApiHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  Connection: "keep-alive",
  Accept: "*",
};
export const recordingStatsEndpoint = "recording-stats";
export const startRecordingEndpoint = "start-recording";
export const stopRecordingEndpoint = "stop-recording";

export const legacyAppUrl = "https://each-moment.web.app";

export * from "./valuesShared";

export * as styles from "./stylingClasses";

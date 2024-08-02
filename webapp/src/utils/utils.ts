import { functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { LabLine, MemBox, Order } from "types";
import { MediaType } from "types";
import {
  MediaTypeMap,
  MemBoxExcessCosts,
  OrderStatuses,
  cupsServerUrl,
  iqrPrinterName,
  mainPrinterName,
  nameItSheetString,
  oqrPrinterName,
  oQRLegacyMatchRegex,
  oQRMatchRegex,
} from "values";

const findFreeId = (array: number[]): number => {
  const sortedArray = array
    .slice() // Make a copy of the array.
    .sort(function (a, b) {
      return a - b;
    }); // Sort it.
  let previousId = 0;
  for (const id of sortedArray) {
    if (id != previousId + 1) {
      // Found a gap.
      return previousId + 1;
    }
    previousId = id;
  }
  // Found no gaps.
  return previousId + 1;
};

export const getNextAvailableId = (ids: string[]): string => {
  const idInts = ids.map((id) => {
    try {
      return parseInt(id);
    } catch {
      return 0;
    }
  });
  const nextId = findFreeId(idInts);

  return `${nextId <= 9 ? "0" : ""}${nextId}`;
};

export const convertRemToPixels = (remIn: number | string) => {
  let rem = 0;
  if (typeof remIn === "string") {
    const remStr = remIn.replace("rem", "");
    rem = parseFloat(remStr);
  }
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const getMediaTypeCounts = (labLines: LabLine[]) => {
  const counts: Record<MediaType, number> = {
    cine: 0,
    av: 0,
    photo: 0,
  };
  labLines.forEach((i) => {
    const mediaType = MediaTypeMap[i.specificMediaType];
    counts[mediaType] += 1;
  });

  return counts;
};

export const getOrderIdFromLabLineId = (labLineId: string): string => {
  return labLineId.substring(0, labLineId.lastIndexOf("-"));
};

export const isPrevStatus = (status: string, targetStatus: string): boolean => {
  const exlcudedStatuses = ["[MB] Depot Received", "[MB] Depot Dispatched"];
  if (
    exlcudedStatuses.includes(status) ||
    exlcudedStatuses.includes(targetStatus)
  ) {
    return false;
  }
  return (
    OrderStatuses.lastIndexOf(targetStatus) < OrderStatuses.lastIndexOf(status)
  );
};

export const generateIqrZpl = (orderId: string, totalLabels: number) => {
  let zpl = "^XA^PW1216";
  const labelsPerRow = 3;
  for (let i = 0; i < totalLabels; i++) {
    const labelPosition = i % labelsPerRow;
    const xOffset = 170 + 400 * labelPosition;
    const itemNumber = `${String(i + 1).padStart(2, "0")}`;

    zpl += `
        ^FX Label ${i + 1} ***********
        ^FO${xOffset},50^BQN,2,8^FDQA,${orderId}-${itemNumber}^FS
        ^FWR^CI13
        ^FO${xOffset - 170},45^A0,45,45^FB200,3,0,C^FD${orderId}^FS^XB
        ^FO${xOffset - 170},45^A0,45,45^FB200,2,0,C^FD${itemNumber}^FS
      `;

    if (labelPosition === labelsPerRow - 1 && i < totalLabels - 1) {
      zpl += "^XZ^XA^PW1216";
    }
  }
  zpl += "^XZ";
  return zpl;
};

export const generateOqrZpl = (orderId: string) => {
  return `
      ^XA
      ^PW1216
      ^LL0812
      ^CF0,90
      ^FO100,200^FD${orderId}^FS
      ^FO208,356^BQN,2,10
      ^FDQA,${orderId}^FS
      ^XZ
    `;
};

export const printZplToCups = async (
  printData: string,
  printerName: string
) => {
  const fileType = "zpl";
  const printerUrl = `${cupsServerUrl}/${fileType}/${printerName}`;
  const dataToSend = { data: printData };
  try {
    const response = await fetch(printerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      console.log("Print job submitted successfully!");
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Print failed:", error);
    alert("Printing failed. Please check the console for more details.");
  }
};

export const printPdfToCups = async (pdfUrl: string, printerName: string) => {
  const fileType = "pdf";
  const printerUrl = `${cupsServerUrl}/${fileType}/${printerName}`;
  const dataToSend = { pdfUrl };
  try {
    const response = await fetch(printerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      console.log("Print job submitted successfully!");
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Print failed:", error);
    alert("Printing failed. Please check the console for more details.");
  }
};

export const printIQRs = async (orderId: string, totalLabels: number) => {
  const zpl = generateIqrZpl(orderId, totalLabels);
  await printZplToCups(zpl, iqrPrinterName);
};

export const printOQR = async (orderId: string) => {
  const { pdfUrl } = await httpsCallable(
    functions,
    "genOqrPdf"
  )({ orderId }).then((result) => {
    const data = result.data as { pdfUrl: string; filePath: string };
    return data;
  });
  await printPdfToCups(pdfUrl, oqrPrinterName);
};

export const printNameItSheet = async () => {
  await printZplToCups(nameItSheetString, mainPrinterName);
};

export const dispatchedStatusPrinting = (order: Order) => {
  console.log(`Printing oQRs, iQRs, and Name-it Sheet for Order ${order.id}`);
  printIQRs(
    order.id,
    MemBoxExcessCosts[order.memory_boxes[0].title as MemBox].includedItems * 2
  );
  printOQR(order.id);
};

export const returnDispatchedStatusPrinting = (order: Order) => {
  alert(`Not yet implemented: Printing Lab Report for Order ${order.id}`);
};

export const getIndexFromIp = (ip: string): string => ip.replace(/\./g, "_");
export const getIpfromIndex = (index: string): string =>
  index.replace(/_/g, ".");

export const getOrderFromItem = (item: string): string => {
  const regexArray =
    item.match(oQRMatchRegex) || item.match(oQRLegacyMatchRegex);
  if (!regexArray) return "";
  const orderId = regexArray[0];
  return orderId;
};

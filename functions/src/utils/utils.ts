import { log } from "firebase-functions/logger";
import { Request } from "firebase-functions/v1";
import { Order, MemBox } from "types";
import {
  MemBoxExcessCosts,
  domainToRegionMap,
  regexDomainRegion,
} from "values";

export const labValueMap = (country_code: string): string =>
  (() => {
    switch (country_code) {
      case "UK":
        return "UK";
      case "GB":
        return "UK";
      default:
        return "EU";
    }
  })();

export const round2dp = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const calculateExtraCost = (order: Order) => {
  // Get extra cost data
  const memoryBoxTypeCosts =
    MemBoxExcessCosts[order.memory_boxes[0].title as MemBox];

  const unitCost = memoryBoxTypeCosts.extraItemPrice;

  // Count total lab lines
  let count = 0;
  Object.values(order.lab_lines ?? []).forEach((labLine) => {
    ["C5", "C7"].includes(labLine.specificMediaType)
      ? (count += 2)
      : (count += 1);
  });

  const included = memoryBoxTypeCosts.includedItems;
  let extraItemsCount = count - included;
  if (extraItemsCount < 0) extraItemsCount = 0;

  const cost = unitCost * extraItemsCount;

  return { count, included, unitCost, cost };
};

export const getRegionFromRequest = async (req: Request) => {
  const url = req.get("Origin");
  if (!url) {
    if (req.get("Host")?.startsWith("127.0.0.1")) return "GB";
    throw new Error("Couldn't get region from request");
  }
  const arr = url.match(regexDomainRegion);
  if (!(arr && arr[0])) {
    throw new Error("Invalid URL");
  }
  const topLevelDomainRegion = arr[0].replace("eachmoment", "");
  const locale = domainToRegionMap[topLevelDomainRegion];
  log(`Got locale: ${locale} from URL ${url}`);
  return locale;
};

export const formatDate = (date: Date | string): string =>
  `${new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })}`;

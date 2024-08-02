import { ItemCounts, ItemCountsCosts, Quote } from "types";
import { round2dp } from "utils";

const itemTranslations: Record<keyof ItemCounts, string> = {
  tapeCount: "Videokassetten (Jeder Typ)",
  cine3Count: "Filme - klein (Bis zu 127mm)",
  cine5Count: "Filme - groß (Über 127mm)",
  slideCount: "Dias (Jede Größe)",
  negativeCount: "Negative (Jede Größe)",
  printsCount: "Fotos (Jede Größe)",
  cassetteCount: "Musikkassetten (Jeder Typ)",
  audioReelSmallCount: "Tonbänder - klein (Bis zu 15mm)",
  audioReelLargeCount: "Tonbänder - groß (Über 15mm)",
};

export function generateTableBody(json: Quote) {
  const items = [];
  const totalItem = { count: 0, cost: 0 };

  Object.keys(json).forEach((keyRaw) => {
    if (keyRaw.endsWith("Count")) {
      const key = keyRaw as keyof ItemCounts;
      const count = json[key];
      if (count == 0) return;
      const item = key.replace("Count", "");
      const itemName = itemTranslations[key];
      const costKey = ("cost" +
        item.charAt(0).toUpperCase() +
        item.slice(1)) as keyof ItemCountsCosts;
      const itemCount = json[key];
      const itemCostPerUnit = round2dp(json[costKey] ?? 0);
      const discountRate = Number(json.discountAmount) / 100;
      const preDiscountPrice = round2dp(itemCostPerUnit / (1 - discountRate));
      const totalCost = round2dp(itemCount * itemCostPerUnit);

      totalItem.count += itemCount;
      totalItem.cost += totalCost;

      items.push([
        itemName,
        itemCount.toString(),
        {
          text: [
            {
              text: `${preDiscountPrice.toFixed(2)}€`,
              decoration: "lineThrough",
            },
            `  ${itemCostPerUnit.toFixed(2)}€`,
          ],
          style: "normalText",
        },
        `${totalCost.toFixed(2)}€`,
      ]);
    }
  });

  if (totalItem.count > 0) {
    items.push([
      { text: "Gesamtpreis der Digitalisierung", style: "totalRow" },
      "",
      "",
      { text: `${totalItem.cost.toFixed(2)}€`, style: "totalRow" },
    ]);
  }

  return items;
}

export function calculateDiscountedTotal(
  discountedTotal: string,
  discountPercentage: string
) {
  const totalAfterDiscount = parseFloat(
    discountedTotal.replace("€", "").trim()
  );
  const discountPercent = parseFloat(discountPercentage);
  const totalBeforeDiscount = totalAfterDiscount / (1 - discountPercent / 100);
  return `${totalBeforeDiscount.toFixed(2)}€`;
}

export function generateOptionsTableBody(json: Quote) {
  const body: ({ text: string; style: string } | string)[][] = [
    [
      { text: "Produkt", style: "tableHeader" },
      { text: "Menge", style: "tableHeader" },
      { text: "Kosten pro Einheit", style: "tableHeader" },
      { text: "Gesamtkosten", style: "tableHeader" },
    ],
  ];

  let totalItems = 0;
  let totalCost = 0;

  const options = [
    {
      name: "Cloud",
      count: parseInt(json.onlineAlbum),
      cost: json.costOnlineAlbum,
    },
    { name: "USB", count: parseInt(json.usb), cost: json.costUsb },
    {
      name: "Premium USB",
      count: parseInt(json.premiumUsb),
      cost: json.costPremiumUSB,
    },
    { name: "DVD Satz", count: parseInt(json.dvd), cost: json.costDVD },
  ];

  options.forEach((option) => {
    if (option.count > 0) {
      const itemTotalCost = (option.count * option.cost).toFixed(2) + "€";
      body.push([
        option.name,
        option.count.toString(),
        option.cost.toFixed(2) + "€",
        itemTotalCost,
      ]);
      totalItems += parseInt(option.count.toString());
      totalCost += parseFloat(itemTotalCost);
    }
  });

  if (totalItems > 0) {
    body.push([
      { text: "Gesamtpreis der Speichermedien", style: "totalRow" },
      { text: "", style: "totalRow" },
      { text: "", style: "totalRow" },
      { text: totalCost.toFixed(2) + "€", style: "totalRow" },
    ]);
  }

  return body;
}

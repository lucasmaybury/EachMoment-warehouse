import { MemBoxLegacy } from "@/types/sharedTypes/OrderType";
import type {
  MediaType,
  MemBox,
  MemBoxExcessCost,
  SpecificMediaType,
} from "../types";

export const MediaTypes: Record<MediaType, SpecificMediaType[]> = {
  cine: ["C3", "C5", "C7"],
  av: [
    "Audio Cassette",
    "Reel Large",
    "Reel",
    "DVD",
    "8mm Cassette",
    "VHS",
    "8mm",
    "Mini DVD",
    "Obscure",
  ],
  photo: ["Prints", "Photography", "Negatives", "Slides"],
};

export const MediaTypeMap: Record<string, MediaType> = Object.keys(
  MediaTypes
).reduce(
  (acc, key) => {
    const value = MediaTypes[key as MediaType];
    value.forEach((specificMediaType) => {
      acc[specificMediaType] = key as MediaType;
    });
    return acc;
  },
  {} as Record<SpecificMediaType, MediaType>
);

export const SpecificMediaTypes: SpecificMediaType[] = [
  "C3",
  "C5",
  "C7",
  "Audio Cassette",
  "Reel Large",
  "Reel",
  "DVD",
  "8mm Cassette",
  "VHS",
  "8mm",
  "Mini DVD",
  "Obscure",
  "Prints",
  "Photography",
  "Negatives",
  "Slides",
];

export const OrderStatuses = [
  "Default",
  "[MB] Dispatched",
  "[MB] Received",
  "[MB] Restoration",
  "[MB] Digitisation",
  "[MB] Quality Control",
  "[MB] Finalising",
  "[MB] Return Dispatched",
  "[MB] Payment Pending",
  "[MB] Depot Received",
  "[MB] Depot Dispatched",
];

export const EmailTriggerStatuses = [
  "[MB] Dispatched",
  "[MB] Received",
  "[MB] Restoration",
  "[MB] Digitisation",
  "[MB] Quality Control",
  "[MB] Finalising",
  "[MB] Return Dispatched",
];

const legacyMemBoxTypes: string[] = [
  "Memory Box Kilo",
  "Memory Box Mega",
  "Memory Box Giga",
  "Memory Box Extra",
  "Memory Box Peta",
];

export const MemoryBoxTypes: string[] = [
  "Memory Box Small",
  "Memory Box Medium",
  "Memory Box Large",
  "Memory Box X Large",
  ...legacyMemBoxTypes,
];

const LegacyMemBoxExcessCosts: Record<MemBoxLegacy, MemBoxExcessCost> = {
  "Memory Box Kilo": { includedItems: 3, extraItemPrice: 15 },
  "Memory Box Mega": { includedItems: 6, extraItemPrice: 14 },
  "Memory Box Giga": { includedItems: 12, extraItemPrice: 13 },
  "Memory Box Extra": { includedItems: 24, extraItemPrice: 12 },
  "Memory Box Peta": { includedItems: 48, extraItemPrice: 11 },
};

// prices in whole pounds, GBP
export const MemBoxExcessCosts: Record<MemBox, MemBoxExcessCost> = {
  "Memory Box Small": { includedItems: 3, extraItemPrice: 15 },
  "Memory Box Medium": { includedItems: 10, extraItemPrice: 14 },
  "Memory Box Large": { includedItems: 20, extraItemPrice: 12 },
  "Memory Box X Large": { includedItems: 40, extraItemPrice: 11 },
  ...LegacyMemBoxExcessCosts,
};

export const DefaultOrderStatus = "Default";

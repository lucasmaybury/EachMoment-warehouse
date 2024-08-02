export type MemBoxLegacy =
  | "Memory Box Kilo"
  | "Memory Box Mega"
  | "Memory Box Giga"
  | "Memory Box Extra"
  | "Memory Box Peta";

export type MemBoxCurrent =
  | "Memory Box Small"
  | "Memory Box Medium"
  | "Memory Box Large"
  | "Memory Box X Large";

export type MemBox = MemBoxLegacy | MemBoxCurrent;

export type MemBoxExcessCost = {
  includedItems: number;
  extraItemPrice: number;
};

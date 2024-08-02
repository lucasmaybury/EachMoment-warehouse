export type ItemCounts = {
  tapeCount: number;
  cine3Count: number;
  cine5Count: number;
  slideCount: number;
  negativeCount: number;
  printsCount: number;
  cassetteCount: number;
  audioReelSmallCount: number;
  audioReelLargeCount: number;
};

export type ItemCountsCosts = {
  costTapeCount: number;
  costCine3Count: number;
  costCine5Count: number;
  costSlideCount: number;
  costNegativeCount: number;
  costPrintsCount: number;
  costCassetteCount: number;
  costAudioReelSmallCount: number;
  costAudioReelLargeCount: number;
};

export type OutputCounts = {
  onlineAlbum: string;
  usb: string;
  premiumUsb: string;
  dvd: string;
};

export type OutputCountsCosts = {
  costOnlineAlbum: number;
  costUsb: number;
  costPremiumUSB: number;
  costDVD: number;
};

export type Quote = {
  f_name: string;
  l_name: string;
  email: string;
  Adresse1: string;
  Adresse2: string;
  Adresse3: string;
  Adresse4: string;
  locale: string;
  Telefonnummer: string;
  outputDigitizationTotalCost: string;
  discountAmount: string;
  note: string;
  finalTotalCost: string;
  shippingCost: number;
} & ItemCounts &
  ItemCountsCosts &
  OutputCounts &
  OutputCountsCosts;

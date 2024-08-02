export const MEMORY_BOX_PROJECT_ID = 8861126623566;
export const storageBucketUrl = `gs://${process.env.GCLOUD_PROJECT}.appspot.com`;
export const corsAllowedOrigins = [
  "https://eachmoment.com",
  "https://eachmoment.net",
  "https://eachmoment.co.uk",
  "https://eachmoment.de",
  "https://eachmoment.at",
  "https://eachmoment.si",
  "https://eachmoment.hr",
  "https://eachmoment.it",
  "https://eachmoment.fr",
  "https://eachmoment.nl",
  "https://eachmoment.ch",
  "https://eachmoment.es",
  "https://www.eachmoment.com",
  "https://www.eachmoment.net",
  "https://www.eachmoment.co.uk",
  "https://www.eachmoment.de",
  "https://www.eachmoment.at",
  "https://www.eachmoment.si",
  "https://www.eachmoment.hr",
  "https://www.eachmoment.it",
  "https://www.eachmoment.fr",
  "https://www.eachmoment.nl",
  "https://www.eachmoment.ch",
  "https://www.eachmoment.es",
];

export const regexDomainRegion = /eachmoment(\.[a-z]{2,3})+/g;

export const domainToRegionMap: Record<string, string> = {
  ".com": "GB",
  ".net": "GB",
  ".co.uk": "GB",
  ".de": "DE",
  ".at": "AT",
  ".si": "SI",
  ".hr": "HR",
  ".it": "IT",
  ".fr": "FR",
  ".nl": "NL",
  ".ch": "CH",
  ".es": "ES",
};

export const regionCodeToCountryMap: Record<string, string> = {
  GB: "United Kingdom",
  DE: "Germany",
  AT: "Austria",
  SI: "Slovenia",
  HR: "Croatia",
  IT: "Italy",
  FR: "France",
  NL: "Netherlands",
  CH: "Switzerland",
  ES: "Spain",
};

export const defaultReceivedDate = new Date("2024-07-16T12:00:00Z");

import { regexDomainRegion } from "values";

const cases = [
  ["eachmoment.co.uk", "eachmoment.co.uk", "GB"],
  ["eachmoment.co.uk/things", "eachmoment.co.uk", "GB"],
  ["eachmoment.co.uk?stuff=0", "eachmoment.co.uk", "GB"],
  ["eachmoment.co.uk", "eachmoment.co.uk", "GB"],
  ["https://eachmoment.de", "eachmoment.de", "DE"],
  ["www.eachmoment.at", "eachmoment.at", "AT"],
  ["eachmoment.si/things", "eachmoment.si", "SI"],
  ["eachmoment.hr?stuff=0", "eachmoment.hr", "HR"],
  ["eachmoment.it:8080", "eachmoment.it", "IT"],
  ["https://www.eachmoment.fr", "eachmoment.fr", "FR"],
  ["eachmoment.nl", "eachmoment.nl", "NL"],
  ["eachmoment.ch", "eachmoment.ch", "CH"],
  ["eachmoment.es", "eachmoment.es", "ES"],
];

test.each(cases)("regexDomainRegion", async (input, domain, region) => {
  const arr = input.match(regexDomainRegion);
  if (!arr?.length) throw new Error("no result");
  const result = arr[0];
  expect(result).toEqual(domain);
});

export const emailTrackerName = (input: string): string => {
  return input.replace("[MB] ", "").replace(" ", "_");
};

export const printEmailTracker = (input: string): string => {
  return `[MB] ${input.replace("_", " ")}`;
};

export type Recorder = {
  name: string;
  ip: string;
  item: string | null;
  recording: boolean;
};

export type Recorders = Record<string, Recorder>;

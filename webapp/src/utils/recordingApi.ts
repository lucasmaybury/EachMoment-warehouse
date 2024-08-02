import {
  recordingApiHeaders,
  recordingApiUrl,
  recordingStatsEndpoint,
  startRecordingEndpoint,
  stopRecordingEndpoint,
} from "@/values";
import { setRecording } from "./recorderHelpers";
import { Recorder } from "@/types";
import { getIndexFromIp } from "./utils";

const toggleRecording = async (
  recorder: Recorder,
  username: string,
  recording: boolean
) => {
  const endpoint = recording ? startRecordingEndpoint : stopRecordingEndpoint;

  fetch(`${recordingApiUrl}/${endpoint}`, {
    method: "post",
    headers: recordingApiHeaders,
    body: JSON.stringify({
      ip: recorder.ip,
      filename: recorder.item,
      user: username,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!Object.hasOwnProperty.call(result, "err")) {
        setRecording(getIndexFromIp(recorder.ip), recording);
      }
    });
};

export const startRecording = async (recorder: Recorder, username: string) => {
  toggleRecording(recorder, username, true);
};

export const stopRecording = async (recorder: Recorder, username: string) => {
  toggleRecording(recorder, username, false);
};

export const updateRecordingFromApi = async (ip: string) => {
  fetch(`${recordingApiUrl}/${recordingStatsEndpoint}`, {
    method: "post",
    headers: recordingApiHeaders,
    body: JSON.stringify({
      ip: ip,
      filename: "test-connection",
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      setRecording(getIndexFromIp(ip), result.data.isRecording);
    });
};

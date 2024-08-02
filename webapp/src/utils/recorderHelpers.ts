import { database } from "@/firebase";
import { Recorder } from "@/types";
import {
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { getIndexFromIp } from "./utils";

export const addRecorder = async (ip: string) => {
  const db = getDatabase();
  await set(ref(db, "recorders/" + getIndexFromIp(ip)), {
    ip,
    name: "",
    recording: false,
    item: null,
  } as Recorder);
  return;
};

export const getRecorderById = async (id: string): Promise<Recorder | null> => {
  const query = ref(database, `recorders/${id}`);
  let order;
  await get(query).then((snapshot) => {
    if (snapshot.exists()) {
      order = snapshot.val();
    }
  });
  return order ?? null;
};

export const getRecorderByIp = async (ip: string): Promise<Recorder | null> => {
  return getRecorderById(getIndexFromIp(ip));
};

export const listenForRecorder = async (
  id: string,
  setRecorder: (recorder: Recorder) => void
): Promise<Recorder> =>
  new Promise((resolve, reject) => {
    const query = ref(database, `recorders/${id}`);
    onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setRecorder(data as Recorder);
        resolve(data);
      } else {
        reject("recorder not found");
      }
    });
  });

const updateRecorder = async (
  recorderId: string,
  updates: Partial<Recorder>
) => {
  const recorderRef = ref(database, "recorders/" + recorderId);
  update(recorderRef, updates);
};

export const setRecorderItem = async (recorderId: string, item: string) => {
  updateRecorder(recorderId, { item });
};

export const setRecorderName = async (recorderId: string, value: string) => {
  updateRecorder(recorderId, { name: value });
};

export const setRecording = async (recorderId: string, value: boolean) => {
  updateRecorder(recorderId, { recording: value });
};

export const resetRecording = async (recorderId: string) => {
  updateRecorder(recorderId, { item: null, recording: false });
};

export const deleteRecorder = async (recorderId: string) => {
  const db = getDatabase();
  await remove(ref(db, "recorders/" + recorderId));
};

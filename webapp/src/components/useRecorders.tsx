import React, { useEffect, useState } from "react";
import { Recorder, Recorders } from "types";
import {
  ref,
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import { database } from "../firebase";

const defaultValue = {
  recorders: {},
};
type RecordersContextType = { recorders: Recorders };
export const RecordersContext =
  React.createContext<RecordersContextType>(defaultValue);

type RecordersProviderProps = {
  children: React.ReactNode;
};

const RecordersProvider = ({ children }: RecordersProviderProps) => {
  const [recorders, setRecorders] = useState<Recorders>({});

  useEffect(() => {
    const recordersRef = ref(database, "recorders");
    get(recordersRef).then((snapshot) => {
      if (snapshot.exists()) {
        setRecorders(
          Object.entries(snapshot.val() as Recorders).reduce(
            (recorders, [id, recorder]) => ({
              ...recorders,
              [id]: recorder,
            }),
            {}
          )
        );
      }
    });

    onChildAdded(recordersRef, (recorder) => {
      if (recorder.exists() && recorder.key && recorder.val()) {
        setRecorders((recordersCurrent) => ({
          ...recordersCurrent,
          [recorder.key!]: recorder.val() as Recorder,
        }));
      }
    });

    onChildChanged(recordersRef, (recorder) => {
      if (recorder.exists() && recorder.key && recorder.val()) {
        setRecorders((recordersCurrent) => ({
          ...recordersCurrent,
          [recorder.key!]: recorder.val() as Recorder,
        }));
      }
    });

    onChildRemoved(recordersRef, (recorder) => {
      if (recorder.exists() && recorder.key) {
        setRecorders((recordersCurrent) => {
          const recordersCopy = { ...recordersCurrent };
          delete recordersCopy[recorder.key!];
          return recordersCopy;
        });
      }
    });
  }, []);

  return (
    <RecordersContext.Provider value={{ recorders }}>
      {children}
    </RecordersContext.Provider>
  );
};

export default RecordersProvider;

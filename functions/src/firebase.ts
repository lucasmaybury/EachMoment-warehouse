import * as admin from "firebase-admin";
import { storageBucketUrl } from "values";

export const databaseInstance = `https://${process.env.GCLOUD_PROJECT}-default-rtdb.europe-west1.firebasedatabase.app`;
export const initializeApp = () => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: databaseInstance,
    storageBucket: storageBucketUrl,
  });
};

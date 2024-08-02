import { log } from "console";
import * as functions from "firebase-functions";
import { CallableContext } from "firebase-functions/v1/https";

export const verifyAuthToken = (context: CallableContext) => {
  log("Verifying auth token");
  if (!context.auth?.uid)
    throw new functions.https.HttpsError("unauthenticated", "Unauthorized");
};

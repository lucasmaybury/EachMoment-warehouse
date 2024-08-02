import { Storage } from "@google-cloud/storage";
import { SaveData } from "@google-cloud/storage/build/cjs/src/file";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { log } from "firebase-functions/logger";
import { storageBucketUrl } from "values";

export async function uploadPdf(
  dir: "invoicePdfs" | "oqrPdfs",
  fileName: string,
  contents: SaveData
) {
  const storage = new Storage();
  const fullFileName = `${dir}/${fileName}`;
  const bucket = storage.bucket(storageBucketUrl);
  const file = bucket.file(fullFileName);
  await file.save(contents);
  log(`${fileName} uploaded to ${dir}.`);

  const fileRef = getStorage().bucket(storageBucketUrl).file(fullFileName);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
}

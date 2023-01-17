import config from "../config";
import FileStorageProvider, { FileResponse } from "./fileStroageProvider";
import firebase from "../firebase";
import SuccessResponse from "../model/successResponse";
import ErrorResponse from "../model/errorResponse";
import logger from "../logger";

const TAG = "FirebaseFileStorageProvider";

const ROOT_BUCKET_PATH = config.firebaseStorageRootBucketPath;

class FirebaseFileStorageProvider implements FileStorageProvider {
  storage = firebase.storage;

  async getFile(bucketPath: string, fileName: string): Promise<FileResponse> {
    try {
      const file = this.storage.bucket(ROOT_BUCKET_PATH).file(`${bucketPath}/${fileName}`);
      const metadata = await file.getMetadata();

      return { contentType: metadata[0].contentType, stream: file.createReadStream() };
    } catch (error: any) {
      logger.logError(TAG, error);
      throw ErrorResponse.internalServerError("Error retrieving image");
    }
  }

  async uploadFile(
    fileName: string,
    mimetype: string,
    bucketPath: string,
    fileContentBuffer: Buffer
  ): Promise<SuccessResponse> {
    return new Promise((resolve: (successResponse: SuccessResponse) => void, reject: (error: any) => void) => {
      try {
        const file = this.storage.bucket(ROOT_BUCKET_PATH).file(`${bucketPath}/${fileName}`);

        file
          .createWriteStream({ contentType: mimetype })
          .on("error", (err) => {
            logger.logError(TAG, `Error uploading image ${err}`);
            reject(err);
          })
          .on("finish", () => resolve(SuccessResponse.createSuccessResponse()))
          .end(fileContentBuffer);
      } catch (error: any) {
        logger.logError(TAG, error);
        reject(new Error("Error uploading image"));
      }
    });
  }
}

export default FirebaseFileStorageProvider;

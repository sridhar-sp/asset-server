import FileStorageProvider, { FileResponse } from "./fileStroageProvider";
import firebase from "../firebase";
import SuccessResponse from "../model/successResponse";
import ErrorResponse from "../model/errorResponse";
import logger from "../logger";

const TAG = "FirebaseFileStorageProvider";

const ROOT_BUCKET_PATH = "gs://trumpcard-dev.appspot.com";

class FirebaseFileStorageProvider implements FileStorageProvider {
  storage = firebase.storage;

  async getFile(bucketPath: string, fileName: string): Promise<FileResponse> {
    try {
      const file = this.storage.bucket(ROOT_BUCKET_PATH).file(`${bucketPath}/${fileName}`);
      const metadata = await file.getMetadata();

      return { contentType: metadata[0].contentType, stream: file.createReadStream() };
    } catch (error: any) {
      logger.logError(TAG, error);
      // Todo Add more error cases
      throw ErrorResponse.internalServerError("Error retrieving image");
    }
  }

  async uploadFile(
    fileName: string,
    mimetype: string,
    bucketPath: string,
    contentEncoding: string,
    fileContentBuffer: Buffer
  ): Promise<SuccessResponse> {
    console.log("**** fileName", fileName);
    console.log("**** mimetype", mimetype);
    console.log("**** bucketPath", bucketPath);
    console.log("**** contentEncoding", contentEncoding);
    console.log("**** fileContentBuffer", fileContentBuffer);

    return SuccessResponse.createSuccessResponse();
  }
}

export default FirebaseFileStorageProvider;

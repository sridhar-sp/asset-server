import ErrorResponse from "../model/errorResponse";
import SuccessResponse from "../model/successResponse";
import FileStorageProvider, { FileResponse } from "./fileStroageProvider";

const invalidStorageProviderError = ErrorResponse.badRequest("Invalid storage provider");

class FallbackFileStorageProvider implements FileStorageProvider {
  getFile(bucketPath: string, fileName: string): Promise<FileResponse> {
    throw invalidStorageProviderError;
  }

  uploadFile(
    fileName: string,
    mimetype: string,
    bucketPath: string,
    fileContentBuffer: Buffer
  ): Promise<SuccessResponse> {
    throw invalidStorageProviderError;
  }
}

export default FallbackFileStorageProvider;

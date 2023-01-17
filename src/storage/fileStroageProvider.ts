import { Readable } from "stream";
import SuccessResponse from "../model/successResponse";

export type FileResponse = {
  contentType: string;
  stream: Readable;
};

interface FileStorageProvider {
  getFile(bucketPath: string, fileName: string): Promise<FileResponse>;

  uploadFile(
    fileName: string,
    mimetype: string,
    bucketPath: string,
    fileContentBuffer: Buffer
  ): Promise<SuccessResponse>;
}

export default FileStorageProvider;

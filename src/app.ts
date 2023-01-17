import express, { Response } from "express";
import multer from "multer";
import config from "./config";
import bodyParser from "body-parser";
import logger from "./logger";
import FileStoreProviderFactory from "./storage/fileStorageProviderFactory";
import singleFileUploadRequestValidator from "./validator/singleImageFileUploadRequestValidatorMiddleware";
import singleImageUploadMiddleware from "./middleware/singleImageFileUploadMiddleware";
import ErrorResponse from "./model/errorResponse";
import { InvalidFileType } from "./constant/error";
import SuccessResponse from "./model/successResponse";
import { HTTP_STATUS_CODES } from "./constant/httpStatusCode";
import singleImageFileGetRequestValidatorMiddleware from "./validator/singleImageFileGetRequestValidatorMiddleware";

const TAG = "APP";

const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

// Todo : Add size limit
const multerImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (SUPPORTED_IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else return cb(new InvalidFileType("file type not supported"));
  },
});

const app: express.Application = express();

app.use(bodyParser.json());

// app.get("/", async (req: any, res: Response) => {
//   res.status(200).json({ status: "Success" });
// });

app.get("/file", singleImageFileGetRequestValidatorMiddleware, async (req: any, res: Response) => {
  try {
    const { contentType, stream } = await FileStoreProviderFactory.getFileStoreProvider(req).getFile(
      req.query.bucketPath,
      req.query.fileName
    );

    res.set("Content-Type", contentType);
    // response.setHeader("Cache-control", "public, max-age=3600");
    stream.pipe(res);
  } catch (error) {
    if (error instanceof ErrorResponse) res.status(error.code).json(error);
    else res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(ErrorResponse.internalServerError());
  }
});

app.post(
  "/image/upload",
  singleImageUploadMiddleware(multerImageUpload, "file"),
  singleFileUploadRequestValidator,
  (req: any, res) => {
    FileStoreProviderFactory.getFileStoreProvider(req)
      .uploadFile(req.body.fileName, req.file.mimetype, req.body.bucketPath, req.file.buffer)
      .then((successResponse: SuccessResponse) => res.status(successResponse.code).json(successResponse))
      .catch((error) => {
        if (error instanceof ErrorResponse) res.status(error.code).json(error);
        else res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(ErrorResponse.internalServerError());
      });
  }
);

app.listen(config.port, () => {
  logger.logInfo(TAG, `${config.appName} running on port ${config.port}`);
});

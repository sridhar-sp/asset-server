import { NextFunction, Response, RequestHandler } from "express";
import multer, { MulterError, ErrorCode } from "multer";
import { FileUploadError, InvalidFileType } from "../constant/error";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";

const singleImageUploadMiddleware = (multer: multer.Multer, imageFileFieldName: string): RequestHandler => {
  const middleware = (req: any, res: Response, next: NextFunction) => {
    const imageUploadResponseHandler = multer.single(imageFileFieldName);
    imageUploadResponseHandler(req, res, (error: any) => {
      if (error == null) {
        next();
      } else {
        let errorResponse: ErrorResponse | null = null;
        if (error instanceof MulterError) {
          if (error.code === "LIMIT_UNEXPECTED_FILE") {
            errorResponse = ErrorResponse.createErrorResponse(
              HTTP_STATUS_CODES.BAD_REQUEST,
              "Required file field is missing"
            );
          } else if (error.code === "LIMIT_FILE_SIZE") {
            errorResponse = ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, "File size is huge");
          } else if (error.code === "LIMIT_FIELD_KEY") {
            errorResponse = ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, "File name is too long");
          }
        } else if (error instanceof FileUploadError) {
          if (error instanceof InvalidFileType)
            errorResponse = ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message);
        }

        if (errorResponse == null)
          errorResponse = ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, "Unknown error");

        res.status(errorResponse.code).json(errorResponse);
      }
    });
  };

  return middleware;
};

export default singleImageUploadMiddleware;

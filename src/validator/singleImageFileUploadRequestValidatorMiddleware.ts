import { NextFunction, Response } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";

const singleImageFileUploadRequestValidatorMiddleware = (req: any, res: Response, next: NextFunction) => {
  const fileName = req.body.fileName;
  const bucketPath = req.body.bucketPath;

  if (typeof fileName === "string" && fileName !== "" && typeof bucketPath === "string" && bucketPath !== "")
    return next();

  const missingFields: Array<string> = [];
  if (!fileName || typeof fileName !== "string") missingFields.push("fileName");
  if (!bucketPath || typeof bucketPath !== "string") missingFields.push("bucketPath");

  const errorResponse = ErrorResponse.createErrorResponse(
    HTTP_STATUS_CODES.BAD_REQUEST,
    `Missing ${missingFields.join()} field(s)`
  );

  res.status(errorResponse.code).json(errorResponse);
};

export default singleImageFileUploadRequestValidatorMiddleware;

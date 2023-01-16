import { NextFunction, Response } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";

const singleImageFileGetRequestValidatorMiddleware = (req: any, res: Response, next: NextFunction) => {
  const fileName = req.query.fileName;
  const bucketPath = req.query.bucketPath;

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

export default singleImageFileGetRequestValidatorMiddleware;

import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import BaseResponse from "./baseResponse";

class ErrorResponse extends BaseResponse {
  static createErrorResponse(code: number, message: string) {
    return new ErrorResponse(code, message);
  }

  static unAuthorized(message = "Unauthorized") {
    return ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, message);
  }

  static internalServerError(message = "InternalServerError") {
    return ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }

  static badRequest(message = "BadRequest") {
    return ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, message);
  }

  toJson() {
    return JSON.stringify(this);
  }
}

export default ErrorResponse;

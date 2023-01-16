import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import BaseResponse from "./baseResponse";

class SuccessResponse extends BaseResponse {
  constructor(code: number, message: string) {
    super(code, message);
  }

  static createSuccessResponse(message = "Success") {
    return new SuccessResponse(HTTP_STATUS_CODES.OK, message);
  }
}

export default SuccessResponse;

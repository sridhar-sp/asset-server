import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Response, NextFunction, Request } from "express";
import { AUTH_PROVIDER_HEADER_KEY } from "../constant/constants";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";
import AuthService from "./authService";

const AUTH_ROUTES = {
  TOKEN_VERIFY: "/token/verify",
};

class AuthServiceImpl implements AuthService {
  axiosInstance: AxiosInstance;

  constructor(endPointBaseUrl: string, apiTimeoutInMilliseconds: number) {
    this.axiosInstance = axios.create({
      baseURL: endPointBaseUrl,
      timeout: apiTimeoutInMilliseconds,
    });
  }

  async verifyAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = await this.verifyAccessToken(req);

      if (status === HTTP_STATUS_CODES.OK) next();
      else throw new Error("Status code mismatch");
    } catch (error: any) {
      const errorResponse = this.parseErrorResponseOrElse(error, ErrorResponse.unAuthorized(error.message));
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  private parseErrorResponseOrElse = (
    error: any,
    defaultResponse: ErrorResponse = ErrorResponse.unAuthorized("Unknown error")
  ) => {
    const errorResponse = error.response?.data;
    if (errorResponse && errorResponse.code && errorResponse.message)
      return new ErrorResponse(errorResponse.code, errorResponse.message);

    return defaultResponse;
  };

  private async verifyAccessToken(req: Request): Promise<AxiosResponse> {
    return this.axiosInstance.get(AUTH_ROUTES.TOKEN_VERIFY, {
      headers: {
        [AUTH_PROVIDER_HEADER_KEY]: req.headers[AUTH_PROVIDER_HEADER_KEY],
        authorization: req.headers.authorization,
      },
    });
  }
}

export default AuthServiceImpl;

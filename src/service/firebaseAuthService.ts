import axios, { AxiosInstance } from "axios";
import { Response, NextFunction } from "express";
import { AUTH_PROVIDER, AUTH_PROVIDER_HEADER_KEY } from "../constant/constants";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import logger from "../logger";
import ErrorResponse from "../model/errorResponse";
import JWTToken from "../model/jwtToken";
import AuthService from "./authService";

const TAG = "FirebaseAuthService";

class FirebaseAuthService implements AuthService {
  axiosInstance: AxiosInstance;

  constructor(endPointBaseUrl: string, apiTimeoutInMilliseconds: number) {
    this.axiosInstance = axios.create({
      baseURL: endPointBaseUrl,
      timeout: apiTimeoutInMilliseconds,
      headers: { [AUTH_PROVIDER_HEADER_KEY]: AUTH_PROVIDER.FIREBASE },
    });
  }

  async verifyToken(authToken: string): Promise<JWTToken> {
    try {
      const { data } = await this.axiosInstance.get("/token/verify", {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      return data as JWTToken;
    } catch (error: any) {
      throw ErrorResponse.unAuthorized(error.response?.data?.message || error.message);
    }
  }

  accessTokenValidatorMiddleware(req: any, res: Response<any, Record<string, any>>, next: NextFunction): void {
    const accessToken = this.parseAccessTokenFromRequest(req);

    if (!accessToken) {
      logger.logInfo(TAG, "Access token is missing in the headers");
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json(ErrorResponse.unAuthorized("Unauthorized. Access token not found"));
      return;
    }

    req.accessToken = accessToken;

    next();
  }

  async verifyAccessTokenMiddleware(
    req: any,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const jwtToken = await this.verifyToken(req.accessToken);
      req.userId = jwtToken.userId;
      next();
    } catch (error: any) {
      if (error instanceof ErrorResponse) res.status(error.code).json(error);
      else res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
    }
  }

  private parseAccessTokenFromRequest = (req: any) => {
    const authorizationValue = req.headers.authorization;

    if (!authorizationValue || !(typeof authorizationValue === "string") || authorizationValue.trim() === "")
      return null;

    const authFields = authorizationValue.split(" ");

    if (!authFields || authFields.length != 2 || authFields[0] !== "Bearer") return null;

    return authFields[1];
  };
}

export default FirebaseAuthService;

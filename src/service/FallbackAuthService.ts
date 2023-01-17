import { Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";
import JWTToken from "../model/jwtToken";
import AuthService from "./authService";

class FallbackAuthService implements AuthService {
  private unAuthErrorResponse = ErrorResponse.unAuthorized("Unauthorized. invalid auth provider");

  verifyToken(_: string): Promise<JWTToken> {
    throw this.unAuthErrorResponse;
  }

  accessTokenValidatorMiddleware(req: any, res: Response<any, Record<string, any>>, next: NextFunction): void {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }

  async verifyAccessTokenMiddleware(
    req: any,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }
}

export default FallbackAuthService;

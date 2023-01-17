import { NextFunction, Response } from "express";
import JWTToken from "../model/jwtToken";

interface AuthService {
  verifyToken(authToken: string): Promise<JWTToken>;

  accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void;
  verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default AuthService;

import { NextFunction, Response, Request } from "express";

interface AuthService {
  verifyAuthMiddleware(req: any, res: Response, next: NextFunction): Promise<void>;
}

export default AuthService;

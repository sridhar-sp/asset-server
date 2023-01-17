import config from "../config";
import { Request, Response, NextFunction } from "express";
import AuthService from "./authService";
import FallbackAuthService from "./fallbackAuthService";
import FirebaseAuthService from "./firebaseAuthService";
import { AUTH_PROVIDER, AUTH_PROVIDER_HEADER_KEY } from "../constant/constants";

class AuthServiceProvider {
  private static authServiceCache: Map<string, AuthService> = new Map();
  private static fallbackAuthService = new FallbackAuthService();

  private constructor() {}

  static getAuthService(request: Request): AuthService {
    if (
      request.headers[AUTH_PROVIDER_HEADER_KEY] &&
      request.headers[AUTH_PROVIDER_HEADER_KEY] === AUTH_PROVIDER.FIREBASE
    ) {
      const cachedFirebaseAuthService = AuthServiceProvider.authServiceCache.get(AUTH_PROVIDER.FIREBASE);
      if (cachedFirebaseAuthService) return cachedFirebaseAuthService;

      const firebaseAuthService = new FirebaseAuthService(config.authServerEndPoint, config.apiTimeoutInMilliseconds);
      AuthServiceProvider.authServiceCache.set(AUTH_PROVIDER.FIREBASE, firebaseAuthService);

      return firebaseAuthService;
    } else {
      return this.fallbackAuthService;
    }
  }

  static accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void {
    return AuthServiceProvider.getAuthService(req).accessTokenValidatorMiddleware(req, res, next);
  }

  static verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): Promise<void> {
    return AuthServiceProvider.getAuthService(req).verifyAccessTokenMiddleware(req, res, next);
  }
}
export default AuthServiceProvider;

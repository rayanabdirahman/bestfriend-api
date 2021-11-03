import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utilities/api-response';
import logger from '../utilities/logger';
import JwtHelper from '../utilities/jwt-helper';
import { JwtPayload } from '../domain/interfaces/user';

const AuthGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check if Authorization header has been defined
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('Authorisation denied. Please sign in');
    }

    // extract jwt from Authorization header by removing Bearer text (format: Bearer token)
    const token = authorization.replace('Bearer ', '');

    // verify token
    const decoded: JwtPayload = await JwtHelper.decode(token);
    if (!decoded) {
      throw new Error(decoded);
    }

    req.user = decoded.user;

    next();
  } catch (error: any) {
    const message = error.message ? error.message : error;
    logger.error(`[AuthGuard] - Unable to authorise user: ${message}`);
    return ApiResponse.error(res, message);
  }
};

export default AuthGuard;

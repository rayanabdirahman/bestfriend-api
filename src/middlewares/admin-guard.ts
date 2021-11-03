import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utilities/api-response';
import logger from '../utilities/logger';

const IsAdminOrOwnerGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (user._id === req.params.id || user.isAdmin) {
      next();
    }

    throw new Error('You are not permitted to perform this action');
  } catch (error: any) {
    const message = error.message ? error.message : error;
    logger.error(
      `[IsAdminOrOwnerGuard] - Unable to authorise user as admin or owner: ${message}`
    );
    return ApiResponse.error(res, message);
  }
};

export default IsAdminOrOwnerGuard;

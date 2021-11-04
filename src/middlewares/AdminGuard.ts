import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utilities/api-response';
import logger from '../utilities/logger';

const AdminGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    if (!user.isAdmin) {
      throw new Error(
        'You do not have the admin rights to perform this action'
      );
    }
    next();
  } catch (error: any) {
    const message = error.message ? error.message : error;
    logger.error(
      `[AdminGuard] - Unable to authorise user as admin: ${message}`
    );
    return ApiResponse.error(res, message);
  }
};

export default AdminGuard;

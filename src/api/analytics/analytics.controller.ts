import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import { AnalyticsService } from '../../services/analytics.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AdminGuard from '../../middlewares/AdminGuard';

@injectable()
export default class AnalyticsController implements RegistrableController {
  private analyticsService: AnalyticsService;

  constructor(
    @inject(TYPES.AnalyticsService) analyticsService: AnalyticsService
  ) {
    this.analyticsService = analyticsService;
  }

  registerRoutes(app: express.Application): void {
    app.get(
      `${config.API_URL}/analytics/mau`,
      AuthenticationGuard,
      AdminGuard,
      this.monthlyActiveUsers
    );
  }

  monthlyActiveUsers = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const users = await this.analyticsService.monthlyActiveUsers();

      return ApiResponse.success(res, users);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AnalyticsController: monthlyActiveUsers] - Unable to find analytics for monthly active users (MAU): ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}

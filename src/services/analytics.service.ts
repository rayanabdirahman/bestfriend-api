import { injectable, inject } from 'inversify';
import { UserRepository } from '../database/repositories/user.repository';
import { MonthlyActiveUsers } from '../domain/interfaces/analytics';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface AnalyticsService {
  monthlyActiveUsers(): Promise<MonthlyActiveUsers[]>;
}

@injectable()
export class AnalyticsServiceImpl implements AnalyticsService {
  private userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async monthlyActiveUsers(): Promise<MonthlyActiveUsers[]> {
    try {
      return await this.userRepository.aggregate();
    } catch (error: any) {
      logger.error(
        `[AnalyticsService: monthlyActiveUsers]: Unabled to find analytics for monthly active users (MAU): ${error}`
      );
      throw error;
    }
  }
}

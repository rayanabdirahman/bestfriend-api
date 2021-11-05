import { injectable, inject } from 'inversify';
import { OrderRepository } from '../database/repositories/order.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { AnalyticsReturnType } from '../domain/interfaces/analytics';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface AnalyticsService {
  monthlyActiveUsers(): Promise<AnalyticsReturnType[]>;
  monthlyIncome(): Promise<AnalyticsReturnType[]>;
}

@injectable()
export class AnalyticsServiceImpl implements AnalyticsService {
  private userRepository: UserRepository;
  private orderRepository: OrderRepository;

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.OrderRepository) orderRepository: OrderRepository
  ) {
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
  }

  async monthlyActiveUsers(): Promise<AnalyticsReturnType[]> {
    try {
      return await this.userRepository.aggregate();
    } catch (error: any) {
      logger.error(
        `[AnalyticsService: monthlyActiveUsers]: Unabled to find analytics for monthly active users (MAU): ${error}`
      );
      throw error;
    }
  }

  async monthlyIncome(): Promise<AnalyticsReturnType[]> {
    try {
      return await this.orderRepository.aggregate();
    } catch (error: any) {
      logger.error(
        `[AnalyticsService: monthlyActiveUsers]: Unabled to find analytics for monthly active users (MAU): ${error}`
      );
      throw error;
    }
  }
}

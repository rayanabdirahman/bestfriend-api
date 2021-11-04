import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import UserController from './api/user/user.controller';
import AccountController from './api/account/account.controller';
import { AccountService, AccountServiceImpl } from './services/account.service';
import {
  UserRepository,
  UserRepositoryImpl
} from './database/repositories/user.repository';
import AnalyticsController from './api/analytics/analytics.controller';
import {
  AnalyticsService,
  AnalyticsServiceImpl
} from './services/analytics.service';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);
container.bind<RegistrableController>(TYPES.Controller).to(AnalyticsController);

// services
container.bind<AccountService>(TYPES.AccountService).to(AccountServiceImpl);
container
  .bind<AnalyticsService>(TYPES.AnalyticsService)
  .to(AnalyticsServiceImpl);

// repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;

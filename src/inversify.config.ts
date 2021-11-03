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

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);

// services
container.bind<AccountService>(TYPES.AccountService).to(AccountServiceImpl);

// repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;

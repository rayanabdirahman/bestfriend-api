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
import ProductController from './api/product/product.controller';
import { ProductService, ProductServiceImpl } from './services/product.service';
import {
  ProductRepository,
  ProductRepositoryImpl
} from './database/repositories/product.repository';
import OrderController from './api/order/order.controller';
import { OrderService, OrderServiceImpl } from './services/order.service';
import {
  OrderRepository,
  OrderRepositoryImpl
} from './database/repositories/order.repository';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);
container.bind<RegistrableController>(TYPES.Controller).to(AnalyticsController);
container.bind<RegistrableController>(TYPES.Controller).to(ProductController);
container.bind<RegistrableController>(TYPES.Controller).to(OrderController);

// services
container.bind<AccountService>(TYPES.AccountService).to(AccountServiceImpl);
container
  .bind<AnalyticsService>(TYPES.AnalyticsService)
  .to(AnalyticsServiceImpl);
container.bind<ProductService>(TYPES.ProductService).to(ProductServiceImpl);
container.bind<OrderService>(TYPES.OrderService).to(OrderServiceImpl);

// repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container
  .bind<ProductRepository>(TYPES.ProductRepository)
  .to(ProductRepositoryImpl);
container.bind<OrderRepository>(TYPES.OrderRepository).to(OrderRepositoryImpl);

export default container;

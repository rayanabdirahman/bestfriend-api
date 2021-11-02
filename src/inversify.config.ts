import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import UserController from './api/user/user.controller';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(UserController);

export default container;

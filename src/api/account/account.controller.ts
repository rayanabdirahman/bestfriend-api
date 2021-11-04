import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { SignInModel, SignUpModel } from '../../domain/interfaces/account';
import AuthorisationGuard from '../../middlewares/AuthorisationGuard';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import { AccountService } from '../../services/account.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AccountValidator from './account.validator';
import AdminGuard from '../../middlewares/AdminGuard';

@injectable()
export default class AccountController implements RegistrableController {
  private accountService: AccountService;

  constructor(@inject(TYPES.AccountService) accountService: AccountService) {
    this.accountService = accountService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/account/signup`, this.signUp);
    app.post(`${config.API_URL}/account/signin`, this.signIn);
    app.get(
      `${config.API_URL}/account/:_id`,
      AuthenticationGuard,
      AdminGuard,
      this.findOne
    );
    app.put(
      `${config.API_URL}/account/update/:_id`,
      AuthenticationGuard,
      AuthorisationGuard,
      this.updateOne
    );
    app.delete(
      `${config.API_URL}/account/delete/:_id`,
      AuthenticationGuard,
      AuthorisationGuard,
      this.deleteOne
    );
  }

  signUp = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: SignUpModel = {
        ...req.body
      };

      // validate request body
      const validity = AccountValidator.signUp(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const user = await this.accountService.signUp(model);

      return ApiResponse.success(res, user);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: signup] - Unable to sign up user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  signIn = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: SignInModel = {
        ...req.body
      };

      // validate request body
      const validity = AccountValidator.signIn(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const user = await this.accountService.signIn(model);

      return ApiResponse.success(res, user);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: signIn] - Unable to sign in user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;

      const user = await this.accountService.findOneById(_id);

      return ApiResponse.success(res, user);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: findOne] - Unable to find user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  updateOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const model: SignUpModel = {
        ...req.body
      };

      // validate request body
      const validity = AccountValidator.updateOne(model);
      if (validity.error) {
        const { message } = validity.error;
        console.log('validation: ', message);
        return ApiResponse.error(res, message);
      }

      const user = await this.accountService.updateOneById(_id, model);

      return ApiResponse.success(res, user);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: updateOne] - Unable to update user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  deleteOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;

      await this.accountService.deleteOneById(_id);

      return ApiResponse.success(res, 'Account successfully deleted');
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: deleteOne] - Unable to delete user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}

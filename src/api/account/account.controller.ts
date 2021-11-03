import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { SignUpModel } from '../../domain/interfaces/account';
import { AccountService } from '../../services/account.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AccountValidator from './account.validator';

@injectable()
export default class AccountController implements RegistrableController {
  private accountService: AccountService;

  constructor(@inject(TYPES.AccountService) accountService: AccountService) {
    this.accountService = accountService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/account/signup`, this.signUp);
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

      // generate JWT token
      const token = await this.accountService.signUp(model);

      return ApiResponse.success(res, token);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[AccountController: signup] - Unable to sign up user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}

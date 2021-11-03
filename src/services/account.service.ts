import { injectable, inject } from 'inversify';
import { UserDocument } from '../database/models/user.model';
import { UserRepository } from '../database/repositories/user.repository';
import { SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface AccountService {
  signUp(model: SignUpModel): Promise<UserDocument>;
}

@injectable()
export class AccountServiceImpl implements AccountService {
  private userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(model: SignUpModel): Promise<UserDocument> {
    try {
      const user = await this.userRepository.createOne(model);

      // sign JWT token
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        error.message = `A user with the given username or email exists`;
      }
      logger.error(
        `[AccountService: signUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }
}

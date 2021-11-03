import CryptoJS, { AES } from 'crypto-js';
import config from '../config';

interface CryptoHelper {
  encryptPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

const CryptoHelper: CryptoHelper = {
  async encryptPassword(password: string): Promise<string> {
    return AES.encrypt(password, `${config.APP_CRYPTO_SECRET}`).toString();
  },
  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return (
      password ===
      AES.decrypt(hashedPassword, `${config.APP_CRYPTO_SECRET}`).toString(
        CryptoJS.enc.Utf8
      )
    );
  }
};

export default CryptoHelper;

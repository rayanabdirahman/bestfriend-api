import CryptoJS, { AES } from 'crypto-js';
import config from '../config';

interface CryptoHelper {
  encryptPassword(password: string): string;
  comparePassword(password: string, hashedPassword: string): boolean;
}

const CryptoHelper: CryptoHelper = {
  encryptPassword(password: string): string {
    return AES.encrypt(password, `${config.APP_CRYPTO_SECRET}`).toString();
  },
  comparePassword(password: string, hashedPassword: string): boolean {
    return (
      password ===
      AES.decrypt(hashedPassword, `${config.APP_CRYPTO_SECRET}`).toString(
        CryptoJS.enc.Utf8
      )
    );
  }
};

export default CryptoHelper;

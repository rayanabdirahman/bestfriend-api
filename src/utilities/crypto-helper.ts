import AES from 'crypto-js/aes';
import config from '../config';

interface CryptoHelper {
  encryptPassword(password: string): Promise<string>;
}

const CryptoHelper: CryptoHelper = {
  async encryptPassword(password: string): Promise<string> {
    return AES.encrypt(password, `${config.APP_CRYPTO_SECRET}`).toString();
  }
};

export default CryptoHelper;

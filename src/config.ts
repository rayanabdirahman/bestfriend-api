const config = {
  APP_PORT: process.env.APP_PORT,
  APP_DB_NAME: process.env.APP_DB_NAME,
  APP_DB_USERNAME: process.env.APP_DB_USERNAME,
  APP_DB_PASSWORD: process.env.APP_DB_PASSWORD,
  API_URL: '/api/v1',
  APP_CRYPTO_SECRET: process.env.APP_CRYPTO_SECRET,
  APP_JWT_SECRET: process.env.APP_JWT_SECRET
};

export default config;

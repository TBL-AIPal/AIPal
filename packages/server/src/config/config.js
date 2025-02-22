const Joi = require('joi');

let databaseSuffix = '';

if (process.env.NODE_ENV === 'production') {
  databaseSuffix = '-prod';
} else {
  databaseSuffix = '-dev';
}

const envVarsSchema = Joi.object()
  .keys({
    SERVER_PORT: Joi.number().default(3000),
    MONGODB_USERNAME: Joi.string().required().description('MongoDB username'),
    MONGODB_PASSWORD: Joi.string().required().description('MongoDB password'),
    MONGODB_HOST: Joi.string().required().description('MongoDB host'),
    MONGODB_PORT: Joi.string().required().description('MongoDB port'),
    MONGODB_DATABASE: Joi.string()
      .required()
      .description('MongoDB database name'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    ENCRYPTION_KEY: Joi.string()
      .required()
      .min(64)
      .description('Encryption key for API keys'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app',
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: process.env.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongoose: {
    // TODO: Add auth
    url: `mongodb://${envVars.MONGODB_HOST}:${envVars.MONGODB_PORT}/${envVars.MONGODB_DATABASE}${databaseSuffix}?directConnection=true`,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  mongodb: {
    // TODO: Add auth
    url: `mongodb://${envVars.MONGODB_HOST}:${envVars.MONGODB_PORT}/?directConnection=true`,
    db: envVars.DATABASE_NAME + databaseSuffix,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  encryption: {
    key: envVars.ENCRYPTION_KEY,
  },
};

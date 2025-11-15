"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: [path_1.default.join(process.cwd(), ".env")] });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_hash_rounds: process.env.BCRYPT_HASH_ROUNDS,
    node_environment: process.env.ENVIRONMENT,
    otp_expires_in: process.env.OTP_EXPIRES_IN,
    access_secret: process.env.ACCESS_SECRET,
    refresh_secret: process.env.REFRESH_SECRET,
    verify_secret: process.env.VERIFY_SECRET,
    otp_secret: process.env.OTP_SECRET,
    access_token_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_token_expires_in: process.env
        .JWT_REFRESH_EXPIRES_IN,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_encryption: process.env.SMTP_ENCRYPTION,
    smtp_user_name: process.env.SMTP_USER_NAME,
    smtp_password: process.env.SMTP_PASSWORD,
    smtp_from_email: process.env.SMTP_FROM_EMAIL,
    smtp_from_name: process.env.SMTP_FROM_NAME,
    rabbitmq_url: process.env.RABBITMQ_URL,
};

import dotenv from "dotenv";
import path from "path";
import ms from "ms";

dotenv.config({ path: [path.join(process.cwd(), ".env")] });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_hash_rounds: process.env.BCRYPT_HASH_ROUNDS,
  node_environment: process.env.ENVIRONMENT,
  otp_expires_in: process.env.OTP_EXPIRES_IN as ms.StringValue,
  access_secret: process.env.ACCESS_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
  verify_secret: process.env.VERIFY_SECRET,
  otp_secret: process.env.OTP_SECRET,
  access_token_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as ms.StringValue,
  refresh_token_expires_in: process.env
    .JWT_REFRESH_EXPIRES_IN as ms.StringValue,
};

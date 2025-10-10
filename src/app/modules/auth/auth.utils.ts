import jwt, { SignOptions, Secret } from "jsonwebtoken";
import ms from "ms";

type TCreateToken = {
  payload: { email: string; otpCode?: string };
  secret: Secret;
  expiresIn: number | ms.StringValue | undefined;
};

export const createToken = ({ payload, secret, expiresIn }: TCreateToken) => {
  const options: SignOptions = {
    expiresIn: typeof expiresIn === "string" ? ms(expiresIn) : expiresIn,
  };
  return jwt.sign(payload, secret, options);
};

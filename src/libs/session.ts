import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    data?: {
      userId: string;
      email: string;
    };
  }
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error("SECRET_COOKIE_PASSWORD env variable not set");
}
export const sessionOptions: IronSessionOptions = {
  cookieName: "MEDIAY_SESSION",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSession = (fn: any) => withIronSessionApiRoute(fn, sessionOptions);

import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";

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

export const withSession = (handler: NextApiHandler) => withIronSessionApiRoute(handler, sessionOptions);

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

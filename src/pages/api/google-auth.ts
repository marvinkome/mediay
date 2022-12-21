/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { OAuth2Client } from "google-auth-library";
import { withSession } from "libs/session";

const LOG_TAG = "[google-auth]";

const authClient = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL
);

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        const { code } = body;

        if (!code) {
          console.warn(LOG_TAG, "no code found in payload", {
            body,
          });
          return res.status(400).json({ error: "Login failed" });
        }

        // get user
        const { tokens } = await authClient.getToken(code as string);
        if (!tokens.id_token) {
          console.warn(LOG_TAG, "Invalid code in payload", {
            body,
          });
          return res.status(400).json({
            error: "Login failed",
          });
        }

        // validate the id token
        const ticket = await authClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const googleId = payload?.sub;
        const email = payload?.email;
        const fullName = payload?.name;

        if (!email) {
          console.error("%s User email not provided - %j", LOG_TAG, { payload, code });
          return res.status(400).json({ error: "Authentication failed" });
        }

        let user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          console.log("%s No user found, creating new user - %j", LOG_TAG, { googleId, data: { fullName } });
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              fullName,
            },
          });
        } else {
          await prisma.user.update({
            where: { email },
            data: { googleId },
          });
        }

        req.session.data = {
          userId: user.id,
          email: user.email,
        };
        await req.session.save();

        // redirect to dashboard
        return res.send({ message: "Auth successful" });
      }
      default:
        console.warn(LOG_TAG, "unauthorized method", method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.error(LOG_TAG, "general error", {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};

export default withSession(handle);

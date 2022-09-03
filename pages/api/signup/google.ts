import type { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import { OAuth2Client } from "google-auth-library";
import prisma from "libs/prisma";

const LOG_TAG = "[auth-google-login]";

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
          console.warn(LOG_TAG, "no code found in payload", { body });
          return res.status(400).json({ error: "Something went wrong. Please try again" });
        }

        // get user
        const { tokens } = await authClient.getToken(code as string);
        if (!tokens.id_token) {
          console.warn(LOG_TAG, "Invalid code in payload", { body });
          return res.status(400).json({ error: "Something went wrong. Please try again" });
        }

        // validate the id token
        const ticket = await authClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const googleId = payload?.sub;
        const email = payload?.email;

        if (!email) {
          console.warn(LOG_TAG, "No email found for token", { body, payload });
          return res.status(400).json({ error: "Something went wrong. Please try again" });
        }

        // find user
        let user = await prisma.user.upsert({
          where: { email },
          create: { email, googleId },
          update: { email, googleId },
        });

        req.session.data = {
          userId: user.id,
          email: user.email,
        };
        await req.session.save();

        return res.send({
          redirect: true,
          url: `/setup/details`,
        });
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

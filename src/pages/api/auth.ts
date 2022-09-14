import { NextApiRequest, NextApiResponse } from "next";
import supabase from "libs/supabase";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[auth]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    switch (method) {
      case "POST": {
        const { access_token } = body;

        if (!access_token) {
          console.warn(LOG_TAG, "no access token in payload", { body });
          return res.status(400).json({ error: "Authentication failed" });
        }

        const { user: supabaseUser, error } = await supabase.auth.api.getUser(access_token);
        if (error) throw error;

        if (!supabaseUser) {
          console.warn(LOG_TAG, "No user found for access token", { token: access_token });
          return res.status(400).json({ error: "Authentication failed" });
        }

        if (!supabaseUser.email) {
          console.error(LOG_TAG, "User email not provided ", { token: access_token, user: supabaseUser });
          return res.status(400).json({ error: "Authentication failed" });
        }

        const supabaseId = supabaseUser.id;
        const email = supabaseUser.email;

        let user = await prisma.user.findFirst({
          where: { email, supabaseId },
        });

        if (!user) {
          console.log(LOG_TAG, "No user found, creating new user", { supabaseId });
          user = await prisma.user.create({
            data: {
              email,
              supabaseId,
            },
          });
        }

        // store session
        req.session.data = {
          userId: user.id,
          email: user.email,
        };
        await req.session.save();

        // redirect to dashboard
        return res.send({ redirect: true, url: `/app` });
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

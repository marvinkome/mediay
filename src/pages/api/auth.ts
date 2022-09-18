import { NextApiRequest, NextApiResponse } from "next";
import supabase from "libs/supabase";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[auth]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body, query } = req;

    switch (method) {
      case "GET": {
        const { email } = query;
        console.log(LOG_TAG, "checking if email exists");

        let user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        return res.send({ exists: !!user });
      }
      case "POST": {
        // HACK:: Receiving the fullName from the body for magic link login
        const { access_token, full_name } = body;

        if (!access_token) {
          console.warn("%s no access token in payload - %j", LOG_TAG, { body });
          return res.status(400).json({ error: "Authentication failed" });
        }

        const { user: supabaseUser, error } = await supabase.auth.api.getUser(access_token);
        if (error) throw error;

        if (!supabaseUser) {
          console.warn("%s No user found for access token - %j", LOG_TAG, { token: access_token });
          return res.status(400).json({ error: "Authentication failed" });
        }

        if (!supabaseUser.email) {
          console.error("%s User email not provided - %j", LOG_TAG, { token: access_token, user: supabaseUser });
          return res.status(400).json({ error: "Authentication failed" });
        }

        console.log("%s Supabase user found - %j", LOG_TAG, { supabaseUser, full_name });

        const supabaseId = supabaseUser.id;
        const email = supabaseUser.email;
        const fullName = full_name || supabaseUser.user_metadata?.full_name;

        let user = await prisma.user.findFirst({
          where: { email, supabaseId },
        });

        if (!user) {
          console.log("%s No user found, creating new user - %j", LOG_TAG, { supabaseId, data: { fullName } });
          user = await prisma.user.create({
            data: {
              email,
              supabaseId,
              fullName,
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
        console.warn("%s unauthorized method - %s", LOG_TAG, method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.error("%s general error - %j", LOG_TAG, {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};

export default withSession(handle);

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { decryptData } from "libs/encrypt";
import { withSession } from "libs/session";

const LOG_TAG = "[get-groups]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      session: { data: session },
    } = req;

    switch (method) {
      case "GET": {
        // verify session
        if (!session || !session.userId) {
          console.warn("%s No logged in user found - %j", LOG_TAG, {
            session,
          });

          return res.send({ redirect: true, url: "/" });
        }

        return res.send("To be implemented");
      }
      default:
        console.warn("%s unauthorized method %s", LOG_TAG, method);
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

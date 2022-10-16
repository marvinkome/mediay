import prisma from "libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";

const LOG_TAG = "[update-account]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body,
      session: { data: session },
    } = req;

    switch (method) {
      case "POST": {
        // verify session
        if (!session || !session.userId) {
          console.warn("%s No logged in user found - %j", LOG_TAG, {
            session,
          });

          return res.send({ redirect: true, url: "/" });
        }

        // validate body
        const { fullName, id } = body;
        if (!fullName) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Invalid payload" });
        }

        console.log("%s updating account - %j", LOG_TAG, {
          body,
        });

        const user = await prisma.user.update({
          where: { id },
          data: { fullName },
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        });

        console.log("%s user updated - %j", LOG_TAG, { user });
        return res.send({ user });
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

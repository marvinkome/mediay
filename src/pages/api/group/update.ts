import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[update-group]";

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
        const { id, name } = body;
        if (!name || !id) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Invalid payload" });
        }

        console.log("%s updating group - %j", LOG_TAG, {
          group: { name: body.name },
        });

        const group = await prisma.group.update({
          where: { id },
          data: { name },
          select: {
            id: true,
            name: true,
          },
        });

        console.log("%s group updated - %j", LOG_TAG, { group });
        return res.send({ group });
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

import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[join-group]";

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

        if (!body.groupId) {
          console.warn("%s No group ID in body - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "No group ID in body" });
        }

        const group = await prisma.group.findUnique({ where: { id: body.groupId } });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            body,
            group,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        //

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

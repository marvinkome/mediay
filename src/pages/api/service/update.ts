import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";
import { encryptData } from "libs/encrypt";

const LOG_TAG = "[update-service]";

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
        const { id, instructions } = body;
        if (!instructions || !id) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Invalid payload" });
        }

        const serviceUser = await prisma.serviceUser.findFirst({
          where: { serviceId: id, userId: session.userId },
          select: { isCreator: true },
        });

        if (!serviceUser || !serviceUser.isCreator) {
          console.warn("%s Only service creator can edit instructions - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Only service owner can edit instructions" });
        }

        console.log("%s updating instructions - %j", LOG_TAG, {
          service: { id },
        });

        const service = await prisma.service.update({
          where: { id },
          data: { instructions: encryptData(instructions) },
          select: {
            id: true,
          },
        });

        console.log("%s service updated - %j", LOG_TAG, { service });
        return res.send({
          service: {
            ...service,
            instructions,
          },
        });
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

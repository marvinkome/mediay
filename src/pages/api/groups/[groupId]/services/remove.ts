import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[remove-service]";

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
        const { id } = body;
        if (!id) {
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
          console.warn("%s Only service creator can delete service - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Only service owner can delete service" });
        }

        console.log("%s deleting services - %j", LOG_TAG, {
          service: { id },
        });

        // remove service users
        const [, service] = await prisma.$transaction([
          prisma.serviceUser.deleteMany({ where: { serviceId: id } }),
          prisma.service.delete({ where: { id }, select: { id: true } }),
        ]);

        console.log("%s service deleted - %j", LOG_TAG, { service });
        return res.send({ service });
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
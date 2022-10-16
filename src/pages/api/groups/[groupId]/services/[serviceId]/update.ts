import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import prisma from "libs/prisma";
import { withSession } from "libs/session";
import { encryptData } from "libs/encrypt";

const LOG_TAG = "[update-group-service]";

const bodySchema = joi.object({
  name: joi.string(),
  cost: joi.number().min(0),
  numberOfPeople: joi.number().min(1),
  instructions: joi.string(),
});

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body,
      query: { serviceId },
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

        const { instructions, ...payload } = body;

        // validate body
        const { error } = bodySchema.validate({ instructions, ...payload });
        if (error) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            error,
            body,
          });

          return res.status(400).send({ error: "Invalid payload, Please check your data" });
        }

        if (!serviceId) {
          console.warn("%s No groupId or serviceId in params - %j", LOG_TAG, {
            serviceId,
          });

          return res.status(404).send({ error: "No groupId or serviceId in params" });
        }

        const serviceUser = await prisma.serviceUser.findFirst({
          where: { serviceId: serviceId as string, userId: session.userId },
          select: { isCreator: true },
        });
        if (!serviceUser || !serviceUser.isCreator) {
          console.warn("%s Only service creator can edit service - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Only service owner can edit service" });
        }

        console.log("%s updating service - %j", LOG_TAG, {
          service: serviceId,
        });

        const service = await prisma.service.update({
          where: { id: serviceId as string },
          data: {
            ...payload,
            instructions: encryptData(instructions),
          },
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

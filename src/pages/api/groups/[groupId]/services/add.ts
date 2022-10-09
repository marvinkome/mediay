import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import prisma from "libs/prisma";
import { decryptData, encryptData } from "libs/encrypt";
import { withSession } from "libs/session";

const LOG_TAG = "[create-service]";

const bodySchema = joi.object({
  name: joi.string().required(),
  cost: joi.number().min(0).required(),
  numberOfPeople: joi.number().min(1).required(),
  instructions: joi.string().required(),
});

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body: { instructions, ...body },
      session: { data: session },
      query: { groupId },
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

        if (!groupId) {
          console.error("%s No group Id in query- %j", LOG_TAG, { groupId });
          return res.send({ error: "Invalid request" });
        }

        // validate body
        const { error } = bodySchema.validate({ instructions, ...body });
        if (error) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            error,
            body,
          });

          return res.status(400).send({ error: "Invalid payload, Please check your data" });
        }

        const groupMember = await prisma.groupMember.findFirst({
          where: { groupId: groupId as string, userId: session.userId },
        });

        if (!groupMember) {
          console.warn("%s User not a member of the group - %j", LOG_TAG, {
            groupId,
            userId: session.userId,
            body,
          });

          return res.status(400).send({ error: "Only members can add service" });
        }

        console.log("%s creating service - %j", LOG_TAG, {
          groupId,
          body,
        });

        const service = await prisma.service.create({
          data: {
            ...body,
            instructions: encryptData(instructions),
            group: {
              connect: {
                id: groupId,
              },
            },

            users: {
              create: [
                {
                  isCreator: true,
                  user: {
                    connect: {
                      id: session.userId,
                    },
                  },
                },
              ],
            },
          },
          select: {
            id: true,
            name: true,
            numberOfPeople: true,
            instructions: true,
            users: {
              select: {
                isCreator: true,
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        });

        console.log("%s created service - %j", LOG_TAG, { service });

        return res.send({
          service: {
            ...service,
            instructions: decryptData(service.instructions),
          },
        });
      }
      default:
        console.warn("%s unauthorized method %s", LOG_TAG, method);
        return res.status(500).send({ error: "unauthorized method" });
    }
  } catch (error) {
    console.error("%s general error - ", LOG_TAG, {
      name: (error as any).name,
      message: (error as any).message,
      stack: (error as any).stack,
    });

    return res.status(500).send({ error: "request failed" });
  }
};

export default withSession(handle);

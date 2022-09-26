import { decryptData } from "libs/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[join-group-service]";

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

        if (!body.groupId || !body.serviceId) {
          console.warn("%s No groupId or serviceId in body - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "No groupId or serviceId in body" });
        }

        const group = await prisma.group.findUnique({ where: { id: body.groupId }, include: { members: true, services: true } });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            body,
            group,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        const member = group.members.find((member) => member.userId === session.userId);
        if (!member) {
          console.warn("%s user not part of this group - %j", LOG_TAG, {
            body,
            group,
            member,
          });

          return res.status(400).send({ error: "You're not part of this group" });
        }

        console.log("%s join group service - %j", LOG_TAG, {
          group: group.id,
          service: body.serviceId,
          userId: session.userId,
        });

        const service = group.services.find((service) => service.id === body.serviceId);
        if (!service) {
          console.warn("%s service not found in this group - %j", LOG_TAG, {
            body,
            group,
            member,
          });

          return res.status(400).send({ error: "Service not found in this group" });
        }

        const serviceUsers = await prisma.serviceUser.findMany({
          where: {
            serviceId: service.id,
          },
        });

        if (service.numberOfPeople <= serviceUsers.length) {
          console.warn("%s Max users in service - %j", LOG_TAG, {
            body,
            group,
            member,
            service,
            serviceUsers,
          });

          return res.status(400).send({ error: "Service is full, No space for new users" });
        }

        const updatedService = await prisma.service.update({
          where: { id: body.serviceId },
          data: {
            users: {
              create: {
                user: {
                  connect: {
                    id: session.userId,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
            numberOfPeople: true,
            instructions: true,
            users: {
              select: {
                userId: true,
              },
            },
          },
        });

        console.log("%s joined service - %j", LOG_TAG, {
          group: group,
          service: service,
          userId: session.userId,
        });

        return res.send({
          service: {
            ...updatedService,
            instructions: decryptData(updatedService.instructions),
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

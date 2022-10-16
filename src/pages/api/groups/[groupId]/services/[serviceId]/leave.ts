import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[leave-group-service]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      query: { groupId, serviceId },
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

        if (!groupId || !serviceId) {
          console.warn("%s No groupId or serviceId in body - %j", LOG_TAG, {
            groupId,
            serviceId,
          });

          return res.status(404).send({ error: "No groupId or serviceId in body" });
        }

        const group = await prisma.group.findUnique({
          where: { id: groupId as string },
          select: {
            members: {
              select: {
                userId: true,
              },
            },
            services: {
              select: {
                id: true,
                numberOfPeople: true,
                users: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            groupId,
            serviceId,
            group,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        const member = group.members.find((member) => member.userId === session.userId);
        if (!member) {
          console.warn("%s user not part of this group - %j", LOG_TAG, {
            group,
            member,
            serviceId,
          });

          return res.status(400).send({ error: "You're not part of this group" });
        }

        const service = group.services.find((service) => service.id === serviceId);
        if (!service) {
          console.warn("%s service not found in this group - %j", LOG_TAG, {
            serviceId,
            group,
          });

          return res.status(400).send({ error: "Service not found in this group" });
        }

        const serviceUser = service.users.find((user) => user.userId === session.userId);
        if (!serviceUser) {
          console.warn("%s User not using this service - %j", LOG_TAG, {
            group,
            member,
            service,
          });

          return res.status(400).send({ error: "You don't use this service" });
        }

        console.log("%s leave group service - %j", LOG_TAG, {
          group,
          service,
          userId: session.userId,
        });

        const updatedService = await prisma.service.update({
          where: { id: serviceId as string },
          data: {
            users: {
              delete: [
                {
                  userId_serviceId: {
                    serviceId: service.id,
                    userId: session.userId,
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
                userId: true,
              },
            },
          },
        });

        console.log("%s left service - %j", LOG_TAG, {
          group: group,
          service: service,
          userId: session.userId,
        });

        return res.send({
          service: updatedService,
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

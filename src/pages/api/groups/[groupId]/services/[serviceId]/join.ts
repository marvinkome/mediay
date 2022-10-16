import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[join-group-service]";

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
          console.warn("%s No groupId or serviceId in params - %j", LOG_TAG, {
            groupId,
            serviceId,
          });

          return res.status(404).send({ error: "No groupId or serviceId in params" });
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
            groupId,
            serviceId,
            group,
            member,
          });

          return res.status(400).send({ error: "You're not part of this group" });
        }

        const service = group.services.find((service) => service.id === serviceId);
        if (!service) {
          console.warn("%s service not found in this group - %j", LOG_TAG, {
            group,
            member,
          });

          return res.status(400).send({ error: "Service not found in this group" });
        }

        const serviceMember = service.users.find((user) => user.userId === session.userId);
        if (serviceMember) {
          console.warn("%s user already using this service - %j", LOG_TAG, {
            group,
            serviceMember,
            member,
          });

          return res.status(400).send({ error: "You already use this service" });
        }

        if (service.numberOfPeople <= service.users.length) {
          console.warn("%s Max users in service - %j", LOG_TAG, {
            group,
            member,
            service,
          });

          return res.status(400).send({ error: "Service is full, No space for new users" });
        }

        console.log("%s join group service - %j", LOG_TAG, {
          group: group,
          service,
          userId: session.userId,
        });

        const updateService = await prisma.service.update({
          where: {
            id: serviceId as string,
          },
          data: {
            users: {
              create: {
                isCreator: false,
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
          service: updateService,
          userId: session.userId,
        });

        return res.send({ service: updateService });
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

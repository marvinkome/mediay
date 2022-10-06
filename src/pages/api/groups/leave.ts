import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[leave-group]";

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

        const group = await prisma.group.findUnique({
          where: { id: body.groupId },
          select: {
            id: true,
            members: true,
            services: {
              include: {
                users: true,
              },
            },
          },
        });
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

        if (member.isAdmin) {
          console.warn("%s admin cannot leave the group - %j", LOG_TAG, {
            body,
            group,
            member,
          });

          return res.status(400).send({ error: "Admin cannot leave the group" });
        }

        // remove user from services
        const userServices = group.services.filter((service) => service.users.find((user) => user.userId === session.userId));

        console.log("%s removing user from all services - %j", LOG_TAG, {
          group,
          userId: session.userId,
          services: userServices,
        });

        await prisma.serviceUser.deleteMany({
          where: {
            userId: session.userId,
            serviceId: {
              in: userServices.map((s) => s.id),
            },
          },
        });

        console.log("%s removed user from all services - %j", LOG_TAG, {
          group,
          userId: session.userId,
          services: userServices,
        });

        console.log("%s removing the user from group - %j", LOG_TAG, {
          group: group.id,
          userId: session.userId,
        });

        const updatedGroup = await prisma.group.update({
          where: { id: body.groupId },
          data: {
            members: {
              delete: [
                {
                  userId_groupId: {
                    groupId: group.id,
                    userId: session.userId,
                  },
                },
              ],
            },
          },

          select: {
            members: {
              select: {
                isAdmin: true,
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },

            services: {
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
            },
          },
        });

        console.log("%s removed user from group - %j", LOG_TAG, {
          group: updatedGroup,
          userId: session.userId,
        });

        return res.send({ services: updatedGroup.services, members: updatedGroup.members });
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

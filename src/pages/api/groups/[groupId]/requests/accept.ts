import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[accept-group-invite]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body,
      query: { groupId },
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

        if (!groupId) {
          console.warn("%s No groupId  - %j", LOG_TAG, {
            body,
          });

          return res.status(404).send(undefined);
        }

        if (!body.userId) {
          console.warn("%s No userId in body - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "Invalid payload" });
        }

        const group = await prisma.group.findUnique({ where: { id: groupId as string }, include: { members: true, requests: true } });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            body,
            group,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        const requestedUser = await prisma.user.findUnique({ where: { id: body.userId } });
        if (!requestedUser) {
          console.warn("%s invalid userId  - %j", LOG_TAG, {
            body,
            group,
            requestedUser,
          });

          return res.status(400).send({ error: "Requesting user not found" });
        }

        const member = group.members.find((member) => member.userId === session.userId);
        if (!member || !member.isAdmin) {
          console.warn("%s user not permitted to accept invites - %j", LOG_TAG, {
            body,
            group,
            member,
          });

          return res.status(400).send({ error: "You're not permitted to accept invites" });
        }

        const request = group.requests.find((request) => request.userId === requestedUser.id);
        if (!request) {
          console.warn("%s request from this user not found - %j", LOG_TAG, {
            body,
            group,
            request,
          });

          return res.status(400).send({ error: "Request from this user not found" });
        }

        console.log("%s adding user to group - %j", LOG_TAG, {
          body,
          group,
        });

        const updatedGroup = await prisma.group.update({
          where: { id: groupId as string },
          data: {
            requests: {
              deleteMany: [
                {
                  userId: body.userId,
                  groupId: body.groupId,
                },
              ],
            },
            members: {
              create: [
                {
                  isAdmin: false,
                  user: {
                    connect: {
                      id: body.userId,
                    },
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
            requests: {
              select: {
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

        console.log("%s accepted request to join group - %j", LOG_TAG, {
          group: updatedGroup,
          body,
        });

        return res.send({
          requests: updatedGroup.requests,
          members: updatedGroup.members,
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

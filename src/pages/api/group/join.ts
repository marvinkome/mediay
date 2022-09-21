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

        console.log("%s sending request to join group - %j", LOG_TAG, {
          group: group.id,
          userId: session.userId,
        });

        const updatedGroup = await prisma.group.update({
          where: { id: body.groupId },
          data: {
            requests: {
              create: [
                {
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

        console.log("%s sent request to join group - %j", LOG_TAG, {
          group: updatedGroup,
          userId: session.userId,
        });

        return res.send({ requests: updatedGroup.requests });
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

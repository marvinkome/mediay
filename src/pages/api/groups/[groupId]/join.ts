import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[join-group]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
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
          console.warn("%s No group ID - %j", LOG_TAG, {
            groupId,
          });

          return res.status(404).send(undefined);
        }

        const group = await prisma.group.findUnique({ where: { id: groupId as string } });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            group,
            groupId,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        const groupMember = await prisma.groupMember.findFirst({
          where: { groupId: group.id, userId: session.userId },
        });

        if (groupMember) {
          console.warn("%s User already a member of the group - %j", LOG_TAG, {
            groupId,
            userId: session.userId,
          });

          return res.status(400).send({ error: "User already a member of this group" });
        }

        console.log("%s sending request to join group - %j", LOG_TAG, {
          group: group.id,
          userId: session.userId,
        });

        const request = await prisma.groupRequest.create({
          data: {
            group: {
              connect: {
                id: group.id,
              },
            },
            user: {
              connect: {
                id: session.userId,
              },
            },
          },
        });

        console.log("%s sent request to join group - %j", LOG_TAG, {
          group: groupId,
          userId: session.userId,
          request,
        });

        return res.send({ request });
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

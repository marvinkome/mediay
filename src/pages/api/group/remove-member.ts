import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "libs/session";
import prisma from "libs/prisma";

const LOG_TAG = "[remove-group-member]";

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

        if (!body.groupId || !body.userId) {
          console.warn("%s No groupId or userId in body - %j", LOG_TAG, {
            body,
          });

          return res.status(400).send({ error: "No groupId or userId in body" });
        }

        const group = await prisma.group.findUnique({ where: { id: body.groupId }, include: { members: true } });
        if (!group) {
          console.warn("%s group not found - %j", LOG_TAG, {
            body,
            group,
          });

          return res.status(400).send({ error: "Group not found" });
        }

        const adminMember = group.members.find((member) => member.userId === session.userId);
        if (!adminMember || !adminMember.isAdmin) {
          console.warn("%s user not pemmitted to remove members - %j", LOG_TAG, {
            body,
            group,
            member: adminMember,
          });

          return res.status(400).send({ error: "You're not pemmitted to remove members" });
        }

        const removingUser = group.members.find((member) => member.userId === body.userId);
        if (!removingUser) {
          console.warn("%s user not part of this group - %j", LOG_TAG, {
            body,
            group,
            member: removingUser,
          });

          return res.status(400).send({ error: "User not part of this group" });
        }

        console.log("%s removing user from group - %j", LOG_TAG, {
          group: group.id,
          userId: body.userId,
        });

        const updatedGroup = await prisma.group.update({
          where: { id: body.groupId },
          data: {
            members: {
              delete: [
                {
                  userId_groupId: {
                    userId: body.userId,
                    groupId: group.id,
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
          },
        });

        console.log("%s sent request to join group - %j", LOG_TAG, {
          group: updatedGroup,
          userId: session.userId,
        });

        return res.send({ members: updatedGroup.members });
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

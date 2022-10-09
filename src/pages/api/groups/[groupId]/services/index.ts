import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";
import { decryptData } from "libs/encrypt";

const LOG_TAG = "[get-group-services]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      session: { data: session },
      query: { search, groupId },
    } = req;

    switch (method) {
      case "GET": {
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

        const groupMember = await prisma.groupMember.findFirst({
          where: { groupId: groupId as string, userId: session.userId },
        });
        const isMember = !!groupMember;

        console.log("%s fetching services - %j", LOG_TAG, {
          search,
        });

        const services = await prisma.service.findMany({
          where: {
            ...(search ? { name: { contains: search as string, mode: "insensitive" } } : {}),
            group: {
              id: groupId as string,
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

        console.log("%s services found - %j", LOG_TAG, {
          search,
          services,
        });

        return res.send({
          services: services.map((service) => {
            return {
              ...service,
              instructions: isMember ? decryptData(service.instructions) : service.instructions,
            };
          }),
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

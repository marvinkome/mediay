import { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { withSession } from "libs/session";

const LOG_TAG = "[get-groups]";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      session: { data: session },
      query,
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

        const search = query.search as string | undefined;

        console.log("%s fetching groups - %j", LOG_TAG, {
          search,
        });

        const groups = await prisma.group.findMany({
          where: {
            ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
            members: {
              some: {
                userId: session.userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        });

        console.log("%s groups found - %j", LOG_TAG, {
          search,
          groups,
        });

        return res.send({ groups });
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

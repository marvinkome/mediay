import { NextApiRequest, NextApiResponse } from "next";
import joi from "joi";
import prisma from "libs/prisma";
import { encryptData } from "libs/encrypt";
import { withSession } from "libs/session";

const LOG_TAG = "[create-group]";

const bodySchema = joi.object({
  name: joi.string().required(),
  notes: joi.string().allow(""),
  services: joi
    .array()
    .items({
      name: joi.string().required(),
      cost: joi.number().min(0).required(),
      numberOfPeople: joi.number().min(1).required(),
      instructions: joi.string().required(),
    })
    .min(1)
    .required(),
});

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

        // validate body
        const { error } = bodySchema.validate(body);
        if (error) {
          console.warn("%s Validation Error - %j", LOG_TAG, {
            error,
            body,
          });

          return res.status(400).send({ error: "Invalid payload, Please check your data" });
        }

        // encrypt service instructions
        const services = (body.services || []).map((service: any) => {
          const encryptedInstructions = encryptData(service.instructions);
          return {
            ...service,
            instructions: encryptedInstructions,
          };
        });

        console.log("%s creating group - %j", LOG_TAG, {
          group: { name: body.name, notes: body.notes },
          services,
        });

        const group = await prisma.group.create({
          data: {
            name: body.name,
            notes: body.notes,

            services: {
              createMany: {
                data: services,
              },
            },

            admin: {
              connect: {
                id: session.userId,
              },
            },
          },
        });

        console.log("%s created group - %j", LOG_TAG, { group });
        return res.send(group);
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

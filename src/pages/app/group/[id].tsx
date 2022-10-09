import React from "react";
import prisma from "libs/prisma";
import Layout from "components/app.layout";
import { decryptData } from "libs/encrypt";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { chakra, Stack, useBreakpointValue } from "@chakra-ui/react";

import Card from "components/groups/card";
import List from "components/groups/list";

const Page = ({ user, group, groups }: any) => {
  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div flex={2}>
        <Card group={group} user={user} />
      </chakra.div>

      <chakra.div flex={1} display={{ base: "none", md: "block" }}>
        <List groups={groups} />
      </chakra.div>
    </Stack>
  );
};

const getServerSidePropsFn: GetServerSideProps = async ({ req, params }) => {
  if (!req.session.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const id = params?.id as string | undefined;

  const user = await prisma.user.findUnique({
    where: { id: req.session.data.userId },
    select: { id: true, fullName: true, email: true },
  });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allGroups = await prisma.group.findMany({
    take: 10,
    where: {
      members: {
        some: {
          userId: req.session.data.userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const group = await prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,

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
      },
    },
  });

  if (!group) {
    return { notFound: true };
  }

  // members
  const member = group.members.find((member) => member.user.id === req.session.data?.userId);
  const isMember = !!member;

  // decrypt services
  const services = group.services.map((service) => {
    return {
      ...service,
      instructions: isMember ? decryptData(service.instructions) : service.instructions,
    };
  });

  const parsedGroup = JSON.parse(
    JSON.stringify({
      ...group,
      services,
    })
  );

  return {
    props: {
      id,
      user,
      groups: allGroups,
      group: parsedGroup,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

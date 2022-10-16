import React from "react";
import prisma from "libs/prisma";
import Layout from "components/app.layout";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { Center, chakra, Image, Heading, Stack, Text } from "@chakra-ui/react";

import GroupList from "components/group-list";

const Page = ({ groups, user }: PageData) => {
  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div display={{ base: "none", md: "block" }} flex={2}>
        <Stack
          px={6}
          py={4}
          h="30%"
          spacing={6}
          alignItems="center"
          backdropBlur="12px"
          backdropFilter="auto"
          rounded="4px 4px 0px 0px"
          bgColor="rgba(255, 255, 255, 0.16)"
        />

        <Center h="70%" bgColor="#fff" flexDirection="column">
          <Image src="/empty-group.svg" alt="empty group" />

          <Heading mb={2} fontSize="2xl">
            Select a group
          </Heading>
          <Text>Access subscriptions by selecting or creating a group</Text>
        </Center>
      </chakra.div>

      <chakra.div flex={1}>
        <GroupList groups={groups} />
      </chakra.div>
    </Stack>
  );
};

export interface PageData {
  user: {
    id: string;
    fullName: string | null;
    email: string;
  };
  groups: {
    id: string;
    name: string;
    members: {
      isAdmin: boolean;
      user: {
        id: string;
      };
    }[];
  }[];
}
const getServerSidePropsFn: GetServerSideProps<PageData> = async ({ req, params }) => {
  if (!req.session.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const paramArr = params?.id as string[] | undefined;
  if (paramArr && paramArr.length > 1) {
    return { notFound: true };
  }
  const id = paramArr?.[0] || null;

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

  const groups = await prisma.group.findMany({
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
      members: {
        where: { isAdmin: true },
        select: { isAdmin: true, user: { select: { id: true } } },
      },
    },
  });

  return {
    props: {
      id,
      groups,
      user,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

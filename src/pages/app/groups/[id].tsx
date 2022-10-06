import React from "react";
import prisma from "libs/prisma";
import Layout from "components/app.layout";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { chakra, Stack, useBreakpointValue } from "@chakra-ui/react";

import Card from "components/groups/card";
import List from "components/groups/list";

type PageProps = {
  id: string;
  groups: {
    id: string;
    name: string;
  }[];
};
const Page = ({ id, groups }: PageProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  React.useEffect(() => {
    if (isDesktop) {
      console.log("redirect to first group id");
    }
  }, [isDesktop]);

  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div flex={2}>
        <Card />
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

  const paramArr = params?.id as string[] | undefined;
  if (paramArr && paramArr.length > 1) {
    return { notFound: true };
  }
  const id = paramArr?.[0] || null;

  const user = await prisma.user.findUnique({
    where: { id: req.session.data.userId },
    select: { fullName: true, email: true },
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
    },
  });

  return {
    props: {
      id,
      groups,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

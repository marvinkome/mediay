import React from "react";
import AppLayout from "components/app.layout";
import prisma from "libs/prisma";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";

type PageProps = {
  user: { fullName?: string; email: string };
};
const Page = ({ user }: PageProps) => {
  return (
    <Container maxW="container.xl" py={6}>
      <Stack mb={6}>
        <Heading fontSize="xl" fontWeight="600">
          My Account
        </Heading>
      </Stack>

      <Stack spacing={6} mb={6}>
        <Stack spacing={2}>
          <Heading fontWeight="400" fontSize="xs" textTransform="uppercase">
            Full Name
          </Heading>

          <Text fontWeight="600">{user.fullName || "--"}</Text>
        </Stack>

        <Stack spacing={2}>
          <Heading fontWeight="400" fontSize="xs" textTransform="uppercase">
            Email Address
          </Heading>

          <Text fontWeight="600">{user.email}</Text>
        </Stack>
      </Stack>
    </Container>
  );
};

const getServerSidePropsFn: GetServerSideProps = async ({ req }) => {
  if (!req.session.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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

  return {
    props: {
      user,
      layoutProps: {
        user: {
          fullName: user.fullName,
        },
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = AppLayout;
export default Page;

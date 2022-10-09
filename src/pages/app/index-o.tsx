import React from "react";
import AppLayout from "components/app.layout";
import NextLink from "next/link";
import prisma from "libs/prisma";
import CreateGroup from "components/groups/modals/create";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { Button, chakra, Container, Heading, LinkBox, LinkOverlay, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

type PageProps = {
  groups: {
    id: string;
    name: string;
  }[];
};
const Page = ({ groups }: PageProps) => {
  return (
    <Container maxW="container.xl" py={6}>
      <Stack mb={6}>
        <Heading fontSize="xl" fontWeight="600">
          All Groups
        </Heading>
      </Stack>

      {!groups.length && (
        <Container maxW="sm" py={6}>
          <Stack alignItems="center" spacing={4}>
            <Text textAlign="center">You have not created any groups yet. Use this button to create your first group</Text>

            <chakra.div>
              <CreateGroup>
                <Button leftIcon={<FiPlus />} fontSize="sm" rounded="full" colorScheme="primary">
                  Create your first group
                </Button>
              </CreateGroup>
            </chakra.div>
          </Stack>
        </Container>
      )}

      <SimpleGrid columns={3} spacing={4}>
        {groups.map((group, idx) => {
          return (
            <LinkBox
              key={group.id}
              as={Stack}
              bgColor="#fff"
              rounded="1.5em"
              border="1px solid rgb(0 0 0 / 10%)"
              alignItems="flex-start"
              px={5}
              py={4}
              spacing={4}
              overflow="hidden"
              minW="0"
              role="group"
              _hover={{ textDecoration: "none", borderColor: "rgb(0 0 0 / 18%)" }}
            >
              <Heading
                fontSize="md"
                fontWeight="700"
                color="primary.500"
                borderBottom="1px solid rgb(0 0 0 / 70%)"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                w="auto"
                maxW="calc(100%)"
                overflow="hidden"
              >
                <NextLink href={`/app/group/${group.id}`} passHref>
                  <LinkOverlay>{group.name}</LinkOverlay>
                </NextLink>
              </Heading>

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} w="full">
                <Text fontWeight="600" fontSize="sm">
                  2 Members
                </Text>
              </Stack>
            </LinkBox>
          );
        })}
      </SimpleGrid>
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
    select: { fullName: true },
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
      groups,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = AppLayout;
export default Page;

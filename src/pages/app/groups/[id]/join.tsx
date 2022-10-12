import React from "react";
import prisma from "libs/prisma";
import { Button, Center, chakra, Container, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { withSessionSsr } from "libs/session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Page = (props: PageData) => {
  return (
    <chakra.div bgImage="url('/bg-1.png')" bgRepeat="no-repeat" bgSize="100% 50vh" minH="100vh">
      <Container maxW="container.lg" py={{ base: 10, md: 32 }} px={{ base: 4, md: 4 }}>
        <Stack
          spacing={{ base: 6 }}
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "stretch" }}
        >
          <Stack w={{ md: "sm" }} spacing={8}>
            <Image w="150px" src="/logo-full.svg" alt="Logo" />

            <Heading as="h1" color="white" fontWeight="600">
              The platform for group subscriptions.
            </Heading>
          </Stack>

          <Stack
            px={4}
            py={4}
            shadow="lg"
            spacing={8}
            rounded="4px"
            w={{ md: "sm" }}
            backdropBlur="12px"
            bgColor="rgba(255, 255, 255, 0.9)"
          >
            <Stack spacing={1}>
              <Text opacity="0.46" fontSize="sm">
                You’re invited to join
              </Text>
              <Heading as="h2" fontSize="lg">
                {props.group.name}
              </Heading>
            </Stack>

            <Stack spacing={0}>
              <Text opacity={0.48} fontSize={{ base: "xs", md: "10px" }} fontWeight="600" textTransform="uppercase">
                Group Admin
              </Text>

              <Text fontWeight="600">{props.admin.fullName}</Text>
            </Stack>

            <Stack spacing={4}>
              <Text opacity={0.48} fontSize={{ base: "xs", md: "10px" }} fontWeight="600" textTransform="uppercase">
                Active Subscriptions
              </Text>

              {!props.services.length && <Text>No active subscriptions</Text>}

              {!!props.services.length && (
                <SimpleGrid columns={4} spacing={4}>
                  {props.services.map((service) => (
                    <Center key={service.id} textAlign="center" bgColor="#fff" rounded="4px" px={4} py={2}>
                      <Image src="/disney+.svg" alt="Netflix" w="full" maxH="40px" />
                    </Center>
                  ))}
                </SimpleGrid>
              )}
            </Stack>

            <Button colorScheme="secondary">Join Group</Button>
          </Stack>
        </Stack>
      </Container>
    </chakra.div>
  );
};

interface PageData {
  isLoggedIn: boolean;
  group: {
    id: string;
    name: string;
  };
  admin: {
    id: string;
    fullName: string | null;
  };
  services: { id: string; name: string }[];
}
const getServerSidePropsFn: GetServerSideProps<PageData> = async ({ req, params }) => {
  const id = params?.id as string | undefined;

  const group = await prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
  if (!group) {
    return { notFound: true };
  }

  const groupAdmin = await prisma.groupMember.findFirst({
    where: {
      groupId: group.id,
      isAdmin: true,
    },
    select: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
  if (!groupAdmin) {
    console.log("[join-group][ssr] Group admin not found $j", { admin: groupAdmin, group, id });
    return { notFound: true };
  }

  const services = await prisma.service.findMany({
    where: {
      groupId: group.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      group,
      services,
      admin: groupAdmin.user,
      isLoggedIn: !!req.session.data?.userId,
    },
  };
};
export const getServerSideProps = withSessionSsr<PageData>(getServerSidePropsFn);

export default Page;

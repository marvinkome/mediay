import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import supabase from "libs/supabase";
import { GetServerSideProps } from "next";
import { Button, Center, chakra, Container, Heading, Image, SimpleGrid, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { withSessionSsr } from "libs/session";
import { AuthContainer, EmailAuth, GoogleAuth } from "components/auth";
import { useMutation } from "@tanstack/react-query";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!appUrl) {
  throw new Error("APP_URL env variable not set");
}

const Page = (props: PageData) => {
  const [hasSentRequest, setHasSentRequest] = React.useState(props.hasSentRequest);
  const authModal = useDisclosure();

  const joinGroup = useMutation(
    async () => {
      const { payload } = await Api().post(`/groups/${props.group.id}/join`);
      return payload;
    },
    {
      onSuccess: () => {
        setHasSentRequest(true);
      },
    }
  );

  // google login
  const googleAuth = async (data: any) => {
    await Api().post("/auth", data);
    await joinGroup.mutateAsync();

    authModal.onClose();
  };

  // email login
  const emailAuth = async (data: { email: string; fullName?: string }) => {
    const { error } = await supabase.auth.signIn(
      { email: data.email },
      {
        shouldCreateUser: true,
        // HACK:: Supabase doesn't allow signIn with extra data, so we pass the fullName as query params
        // so it can be used from the callback link
        redirectTo: `${appUrl}/app/groups/${props.group.id}/join/emailcb?full_name=${encodeURIComponent(data?.fullName || "")}`,
      }
    );
    if (error) throw error;
  };

  return (
    <chakra.div bgImage="url('/bg-1.png')" bgRepeat="no-repeat" bgSize="100% 45vh" minH="100vh">
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

            {hasSentRequest ? (
              <Text fontSize="sm" color="rgb(0 0 0 / 68%)">
                Your request to join &quot;{props.group.name}&quot; has been sent. Please contact the admin to accept your request.
              </Text>
            ) : (
              <>
                <Button
                  colorScheme="secondary"
                  isLoading={joinGroup.isLoading}
                  onClick={() => (props.isLoggedIn ? joinGroup.mutate() : authModal.onOpen())}
                >
                  Join Group
                </Button>

                {joinGroup.isError && (
                  <Text color="red.600" fontSize="xs">
                    Error sending request to join group. Please try again.
                  </Text>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Container>

      <AuthContainer isOpen={authModal.isOpen} onClose={authModal.onClose}>
        <EmailAuth auth={emailAuth} />

        <Text textAlign="center" fontSize="xs" color="rgb(0 0 0 / 58%)">
          OR
        </Text>

        <GoogleAuth auth={googleAuth} />
      </AuthContainer>
    </chakra.div>
  );
};

interface PageData {
  isLoggedIn: boolean;
  hasSentRequest: boolean;
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
      members: {
        where: {
          OR: [
            {
              isAdmin: true,
            },
            {
              userId: req.session.data?.userId,
            },
          ],
        },
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
      requests: {
        where: {
          userId: req.session.data?.userId,
        },
        select: {
          userId: true,
        },
      },
      services: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!group) {
    return { notFound: true };
  }

  const isMember = group.members.find((member) => member.user.id === req.session.data?.userId);
  if (isMember) {
    return {
      redirect: {
        destination: `/app/groups/${group.id}`,
        permanent: false,
      },
    };
  }

  const groupAdmin = group.members.find((member) => member.isAdmin);
  if (!groupAdmin) {
    console.log("[join-group][ssr] Group admin not found $j", { admin: groupAdmin, group, id });
    return { notFound: true };
  }

  return {
    props: {
      group,
      services: group.services,
      admin: groupAdmin.user,
      hasSentRequest: !!group.requests.length,
      isLoggedIn: !!req.session.data?.userId,
    },
  };
};
export const getServerSideProps = withSessionSsr<PageData>(getServerSidePropsFn);

export default Page;

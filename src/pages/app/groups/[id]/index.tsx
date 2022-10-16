import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import Layout from "components/app.layout";
import { decryptData } from "libs/encrypt";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "libs/session";
import {
  Button,
  Center,
  chakra,
  CircularProgress,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { randomColor } from "@chakra-ui/theme-tools";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "react-use";
import { useRouter } from "next/router";

import { IoIosAdd } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { FiEdit, FiMoreVertical } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import AddService from "components/add-service";
import EditService from "components/edit-service";
import GroupList from "components/group-list";
import ServiceList from "components/service-list";

import { routeReplace } from "libs/utils";

type MembersProps = {
  members: PageData["members"];
  requests: PageData["requests"];
  user: PageData["user"];
  group: PageData["group"];
};
const Members = ({ group, members, requests, user }: MembersProps) => {
  const router = useRouter();
  const toast = useToast();

  const admin = members.find((m) => m.isAdmin);
  const groupMembers = members.filter((m) => !m.isAdmin);

  const isAdmin = admin?.user.id === user.id;

  const acceptRequest = useMutation(
    async ({ userId }: { userId: string }) => {
      const { payload } = await Api().post(`/groups/${group.id}/requests/accept`, { userId });
      await routeReplace(router.asPath);

      return payload;
    },
    {
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error accepting request",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const declineRequest = useMutation(
    async ({ userId }: { userId: string }) => {
      const { payload } = await Api().post(`/groups/${group.id}/requests/decline`, { userId });
      await routeReplace(router.asPath);

      return payload;
    },
    {
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error declining request",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return (
    <>
      <chakra.div>
        <Stack py={2}>
          <Heading
            as="h4"
            py={2}
            fontSize="xs"
            opacity={0.48}
            fontWeight="600"
            textTransform="uppercase"
            borderBottom="1px solid rgba(58, 27, 234, 0.08)"
          >
            Group Admin
          </Heading>
        </Stack>

        <Stack spacing={2}>
          <Stack py={2} spacing={3} direction="row" alignItems="center">
            <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: admin?.user.fullName || "" })} />
            <Text flexGrow="1">{admin?.user.fullName}</Text>
          </Stack>
        </Stack>
      </chakra.div>

      {!!groupMembers.length && (
        <chakra.div>
          <Stack py={2}>
            <Heading
              as="h4"
              py={2}
              fontSize="xs"
              opacity={0.48}
              fontWeight="600"
              textTransform="uppercase"
              borderBottom="1px solid rgba(58, 27, 234, 0.08)"
            >
              {groupMembers.length} Members
            </Heading>
          </Stack>

          <Stack spacing={2}>
            {groupMembers.map((member, idx) => (
              <Stack key={idx} py={2} spacing={3} direction="row" alignItems="center">
                <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: member.user.fullName || "" })} />
                <Text flexGrow="1">{member.user.fullName}</Text>
              </Stack>
            ))}
          </Stack>
        </chakra.div>
      )}

      {!!requests.length && isAdmin && (
        <chakra.div>
          <Stack py={2}>
            <Heading
              as="h4"
              py={2}
              fontSize="xs"
              opacity={0.48}
              fontWeight="600"
              textTransform="uppercase"
              borderBottom="1px solid rgba(58, 27, 234, 0.08)"
            >
              {requests.length} Requests
            </Heading>
          </Stack>

          <Stack spacing={2}>
            {requests.map((request, idx) => (
              <Stack key={idx} py={2} spacing={3} direction="row" alignItems="center">
                <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: request.user.fullName || "" })} />
                <Text flexGrow="1">{request.user.fullName}</Text>

                <Stack direction="row">
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    isDisabled={declineRequest.isLoading}
                    isLoading={acceptRequest.isLoading}
                    onClick={() => acceptRequest.mutate({ userId: request.user.id })}
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    isDisabled={acceptRequest.isLoading}
                    isLoading={declineRequest.isLoading}
                    onClick={() => declineRequest.mutate({ userId: request.user.id })}
                  >
                    Decline
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </chakra.div>
      )}
    </>
  );
};

const Page = ({ user, group, members, requests, groups, services, ...props }: PageData) => {
  const admin = members.find((m) => m.isAdmin);

  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div flex={2}>
        <Tabs variant="soft-rounded">
          <Stack
            px={6}
            py={4}
            spacing={6}
            backdropFilter="auto"
            backdropBlur="12px"
            bgColor="rgba(255, 255, 255, 0.16)"
            rounded="4px 4px 0px 0px"
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Heading as="h1" fontSize="2xl" color="white">
                {group.name}
              </Heading>

              <AddService
                variant="ghost"
                colorScheme="whiteAlpha"
                color="white"
                fontWeight="700"
                fontSize="xs"
                textTransform="uppercase"
                leftIcon={<Icon boxSize={5} as={IoIosAdd} />}
              >
                Add Subscription
              </AddService>
            </Stack>

            <TabList>
              <Stack direction="row">
                <Tab color="white" opacity="0.68" _selected={{ opacity: 1, bgColor: "rgba(255, 255, 255, 0.16)" }}>
                  Subscriptions
                </Tab>

                <Tab color="white" opacity="0.68" _selected={{ opacity: 1, bgColor: "rgba(255, 255, 255, 0.16)" }}>
                  Members
                </Tab>
              </Stack>
            </TabList>
          </Stack>

          <chakra.main bgColor="white" minH="40vh">
            <TabPanels>
              <TabPanel p={0}>
                <ServiceList admin={admin} services={services} />
              </TabPanel>

              <TabPanel p={0}>
                <Stack px={6} py={4}>
                  <Members group={group} members={members} requests={requests} user={user} />
                </Stack>
              </TabPanel>
            </TabPanels>
          </chakra.main>
        </Tabs>
      </chakra.div>

      <chakra.div flex={1} display={{ base: "none", md: "block" }}>
        <GroupList groups={groups} />
      </chakra.div>
    </Stack>
  );
};

export interface PageData {
  user: {
    id: string;
    isAdmin: boolean;
    fullName: string | null;
    email: string;
  };
  group: {
    id: string;
    name: string;
  };
  services: {
    id: string;
    name: string;
    cost: number;
    numberOfPeople: number;
    instructions: string;
    users: {
      isCreator: boolean;
      user: {
        id: string;
        fullName: string | null;
      };
    }[];
  }[];
  members: {
    user: {
      id: string;
      fullName: string | null;
    };
    isAdmin: boolean;
  }[];
  requests: {
    user: {
      id: string;
      fullName: string | null;
    };
  }[];
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

  const groupData = await prisma.group.findUnique({
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
      requests: {
        select: {
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
          cost: true,
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
  if (!groupData) {
    return { notFound: true };
  }

  let { services, requests, members, ...group } = groupData;

  const member = members.find((member) => member.user.id === req.session.data?.userId);
  const isMember = !!member;
  if (!isMember) {
    return {
      redirect: {
        destination: `/app/groups/${group.id}/join`,
        permanent: false,
      },
    };
  }

  services = services
    .map((service) => {
      return {
        ...service,
        instructions: isMember ? decryptData(service.instructions) : service.instructions,
      };
    })
    .sort((a, b) => {
      const isAMember = !!a.users.find((u) => u.user.id === req.session.data?.userId);
      const isBMember = !!b.users.find((u) => u.user.id === req.session.data?.userId);

      if (isAMember) return -1;
      if (isBMember) return 1;

      return 0;
    });

  return {
    props: {
      id,
      group,
      members,
      requests,
      services,
      groups,
      user: {
        ...user,
        isAdmin: member.isAdmin,
      },
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr<PageData>(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

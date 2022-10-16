import React from "react";
import prisma from "libs/prisma";
import Layout from "components/app.layout";
import { decryptData } from "libs/encrypt";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { chakra, Heading, Icon, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { IoIosAdd } from "react-icons/io";

import AddService from "components/add-service";
import GroupMembers from "components/group-members";
import GroupList from "components/group-list";
import ServiceList from "components/service-list";

const Page = ({ group, members, requests, groups, services }: PageData) => {
  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div flex={2}>
        <Tabs variant="soft-rounded">
          <Stack
            px={{ base: 3, md: 6 }}
            py={4}
            spacing={6}
            backdropFilter="auto"
            backdropBlur="12px"
            bgColor="rgba(255, 255, 255, 0.16)"
            rounded={{ base: "0px", md: "4px 4px 0px 0px" }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Heading as="h1" fontSize={{ base: "xl", md: "2xl" }} color="white">
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
                <chakra.span>Add Subscription</chakra.span>
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
                <ServiceList services={services} />
              </TabPanel>

              <TabPanel p={0}>
                <GroupMembers group={group} members={members} requests={requests} />
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
        backButton: {
          href: "/app/groups",
          title: "Groups",
        },
      },
    },
  };
};
export const getServerSideProps = withSessionSsr<PageData>(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

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
import { List } from "pages/app/groups";
import { routeReplace } from "libs/utils";

const Service = ({ service, user }: { service: PageData["services"][0]; user: PageData["user"] }) => {
  const toast = useToast();
  const serviceModal = useDisclosure();
  const confirmRemoveModal = useDisclosure();
  const [isEditing, setEditing] = useBoolean();

  const { query } = useRouter();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [instructions, setInstructions] = React.useState(service.instructions);

  const addedBy = service.users.find((u: any) => u.isCreator)?.user;
  const isOwner = addedBy?.id === user.id;

  const queryClient = useQueryClient();
  const editServiceMutation = useMutation(async (data: any) => {
    return Api().post(`/groups/${query.id}/services/update`, data);
  });

  const removeServiceMutation = useMutation(
    async () => {
      return Api().post(`/groups/${query.id}/services/remove`, {
        id: service.id,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["services", query.id]);
      },

      onError: (err: any) => {
        console.error(err);

        toast({
          title: "Error removing subscription",
          description: err?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const toggleEditingState = () => {
    setEditing.toggle();

    isEditing ? textareaRef.current?.blur() : textareaRef.current?.focus();
  };

  const onSubmitInstructions = async (e: React.FormEvent) => {
    e.preventDefault();

    await editServiceMutation.mutateAsync({
      id: service.id,
      instructions,
    });

    setEditing.off();
  };

  return (
    <Stack
      px={4}
      py={4}
      spacing={4}
      rounded="4px"
      direction="row"
      key={service.id}
      alignItems="center"
      border="1px solid rgba(58, 27, 234, 0.06)"
      _hover={{ borderColor: "rgba(58, 27, 234, 0.12)" }}
    >
      <Stack direction="row" cursor="pointer" onClick={serviceModal.onOpen}>
        <Image boxSize={10} src="/disney+.svg" alt={service.name} />
        <Stack spacing={1} justifyContent="space-between">
          <Heading as="h2" fontWeight="600" fontSize="md" textTransform="capitalize">
            {service.name}
          </Heading>

          {!!addedBy && addedBy.fullName && (
            <Text fontSize="sm" opacity={0.6}>
              Added by {addedBy.fullName}
            </Text>
          )}
        </Stack>
      </Stack>

      <Stack role="group" ml="auto !important" direction="row" alignItems="center" spacing={4}>
        <Text textTransform="uppercase" fontSize="xs" fontWeight="600">
          {service.numberOfPeople - service.users.length} Spot left
        </Text>

        <chakra.div>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="open service option menu"
              icon={<Icon as={FiMoreVertical} boxSize={5} />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              color="gray.700"
            />

            <MenuList py={0} rounded="4px" border="1px solid rgba(2, 2, 4, 0.08)" filter="drop-shadow(0px 8px 64px rgba(0, 0, 0, 0.1))">
              <MenuItem
                fontSize="sm"
                _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
                _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
                onClick={confirmRemoveModal.onOpen}
              >
                Remove subscription
              </MenuItem>
            </MenuList>
          </Menu>
        </chakra.div>
      </Stack>

      {/* service modal */}
      <Modal
        isOpen={serviceModal.isOpen}
        onClose={serviceModal.onClose}
        size="lg"
        motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}
      >
        <ModalOverlay />
        <ModalContent
          px={6}
          rounded="0px"
          overflow="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
        >
          <ModalHeader px={0} pt={4}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="600">
                Subscription
              </Heading>

              <IconButton
                size="sm"
                variant="outline"
                rounded="full"
                onClick={() => serviceModal.onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0} pt={4} pb={4}>
            <Stack direction="row" alignItems="flex-start" rounded="4px" mb={5}>
              <Image boxSize={10} src="/netflix.svg" alt="netflix" />
              <Stack spacing={1} justifyContent="space-between">
                <Heading as="h2" fontWeight="600" fontSize="md" textTransform="capitalize">
                  {service.name}
                </Heading>

                {!!addedBy && (
                  <Text fontSize="sm" opacity={0.6}>
                    Added by {addedBy.fullName}
                  </Text>
                )}
              </Stack>

              <Stack ml="auto !important" direction="row" alignItems="center" spacing={4}>
                <Text textTransform="uppercase" fontSize="xs" fontWeight="600">
                  {service.numberOfPeople - service.users.length} Spot left
                </Text>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Text fontSize="lg">Instructions</Text>

              {!isEditing && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorScheme="primary"
                  rounded="full"
                  aria-label="edit instructions"
                  icon={<FiEdit />}
                  onClick={() => toggleEditingState()}
                />
              )}
            </Stack>

            <Stack as="form" onSubmit={onSubmitInstructions} mt={2}>
              <Textarea
                ref={textareaRef}
                minH={32}
                border="0px"
                opacity={0.72}
                readOnly={isOwner && !isEditing}
                px={2}
                py={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                isDisabled={editServiceMutation.isLoading}
              />

              {isOwner && isEditing && (
                <chakra.div pt={2} textAlign="right">
                  <Button
                    mr={4}
                    variant="ghost"
                    colorScheme="primary"
                    onClick={() => setEditing.off()}
                    isDisabled={editServiceMutation.isLoading}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" colorScheme="primary" isLoading={editServiceMutation.isLoading}>
                    Update Instructions
                  </Button>
                </chakra.div>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* confirm delete modal */}
      <Modal
        isOpen={confirmRemoveModal.isOpen}
        onClose={confirmRemoveModal.onClose}
        motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}
      >
        <ModalContent
          px={6}
          rounded="4px"
          overflow="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
        >
          <ModalHeader px={0} pt={4}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="600">
                Remove Subscription
              </Heading>

              <IconButton
                size="sm"
                variant="outline"
                rounded="full"
                onClick={() => confirmRemoveModal.onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0}>
            <Text>Are you sure you want to remove this subscription?</Text>
          </ModalBody>

          <ModalFooter px={0}>
            <Button
              mr={3}
              variant="ghost"
              colorScheme="gray"
              fontSize="sm"
              onClick={confirmRemoveModal.onClose}
              isDisabled={removeServiceMutation.isLoading}
            >
              Cancel
            </Button>

            <Button
              colorScheme="red"
              fontSize="sm"
              onClick={() => removeServiceMutation.mutate()}
              isLoading={removeServiceMutation.isLoading}
            >
              Remove subscription
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

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

const Page = ({ user, group, members, requests, groups, ...props }: PageData) => {
  const [initialServices, setInitialServices] = React.useState<PageData["services"] | undefined>(props.services);
  const [rawSearch, setRawSearch] = React.useState<string>();
  const [search, setSearch] = React.useState<string>();

  useDebounce(() => setSearch(rawSearch), 2000, [rawSearch]);

  React.useEffect(() => {
    setInitialServices(undefined);
  }, []);

  const { data: services, isLoading } = useQuery<PageData["services"]>({
    queryKey: ["services", group.id, search],
    queryFn: async () => {
      const { payload } = await Api().get(`/groups/${group.id}/services?search=${search ?? ""}`);
      return payload.services;
    },
    initialData: initialServices,
  });

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

              <AddService>
                <Button
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  color="white"
                  fontWeight="700"
                  fontSize="xs"
                  textTransform="uppercase"
                  leftIcon={<Icon boxSize={5} as={IoIosAdd} />}
                >
                  Add Subscription
                </Button>
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

            <chakra.div w="60%">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon color="white" as={RiSearchLine} />
                </InputLeftElement>

                <Input
                  rounded="50px"
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.24)"
                  type="text"
                  placeholder="Search subscriptions"
                  value={rawSearch || ""}
                  onChange={(e) => setRawSearch(e.target.value)}
                  _placeholder={{ color: "rgba(255, 255, 255, 0.24)" }}
                  _focus={{ borderColor: "rgba(255, 255, 255, 0.64)", outline: "none", boxShadow: "none" }}
                />

                <InputRightElement pointerEvents="none">
                  {isLoading && <CircularProgress isIndeterminate size="20px" color="primary.200" />}
                </InputRightElement>
              </InputGroup>
            </chakra.div>
          </Stack>

          <chakra.main bgColor="white" minH="40vh">
            <TabPanels>
              <TabPanel p={0}>
                <Stack spacing={4} px={6} py={4}>
                  {!isLoading && (search || search?.length) && !services?.length && (
                    <Center h="40vh" bgColor="#fff" flexDirection="column">
                      <Heading mb={2} fontSize="2xl">
                        No subscription found
                      </Heading>
                      <Text>No subscription found containing &quot;{search}&quot;</Text>
                    </Center>
                  )}

                  {!search && !services?.length && !isLoading && (
                    <Center h="45vh" bgColor="#fff" flexDirection="column">
                      <Image src="/empty-subs.svg" alt="empty group" />

                      <Heading mb={1} fontSize="2xl">
                        No Subscriptions
                      </Heading>

                      <Text color="rgb(0 0 0 / 55%)" mb={4}>
                        Click to add a new subscription
                      </Text>

                      <AddService>
                        <Button fontSize="sm" colorScheme="primary" leftIcon={<Icon boxSize={5} as={IoIosAdd} />}>
                          Add Subscription
                        </Button>
                      </AddService>
                    </Center>
                  )}

                  {services?.map((service) => (
                    <Service key={service.id} service={service} user={user} />
                  ))}
                </Stack>
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
        <List groups={groups} user={user} />
      </chakra.div>
    </Stack>
  );
};

interface PageData {
  user: {
    id: string;
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

  services = services.map((service) => {
    return {
      ...service,
      instructions: isMember ? decryptData(service.instructions) : service.instructions,
    };
  });

  return {
    props: {
      id,
      user,
      group,
      members,
      requests,
      services,
      groups,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr<PageData>(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

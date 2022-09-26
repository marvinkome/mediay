import React from "react";
import prisma from "libs/prisma";
import Api from "libs/api";
import AppLayout from "components/app.layout";
import dayjs from "dayjs";
import ConfirmButton from "components/confirm-button";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import { decryptData } from "libs/encrypt";
import {
  Button,
  chakra,
  Container,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCopyOutline, IoPersonRemoveOutline, IoExitOutline, IoAdd } from "react-icons/io5";
import { RiUserAddLine, RiEditLine } from "react-icons/ri";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type InstructionsModalProps = {
  children: React.ReactElement;
  serviceId: string;
  instructions: string;
  leaveServiceMutation: any;
};
const InstructionsModal = ({ children, instructions, ...props }: InstructionsModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />

        <ModalContent my={8} rounded="20px">
          <ModalHeader pb={3}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton
                aria-label="close-modal"
                size="xs"
                icon={<Icon boxSize="16px" as={IoMdCloseCircle} />}
                p={0}
                rounded="full"
                bgColor="primary.50"
                _hover={{ bgColor: "primary.100" }}
                onClick={() => onClose()}
              />

              <Text fontSize="sm" color="rgb(0 0 0 / 75%)">
                Instructions
              </Text>
            </Stack>
          </ModalHeader>

          <ModalBody px={6} py={0} pb={4}>
            <Stack spacing={4}>
              <Text fontSize="sm">{instructions}</Text>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  colorScheme="primary"
                  rounded="24px"
                  variant="ghost"
                  leftIcon={<Icon as={IoExitOutline} />}
                  bgColor="primary.50"
                  fontSize="sm"
                  size="sm"
                  border="1px solid transparent"
                  _hover={{ borderColor: "primary.600" }}
                  onClick={() => props.leaveServiceMutation.mutate(props.serviceId)}
                  isLoading={props.leaveServiceMutation.isLoading}
                >
                  Leave service
                </Button>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

type PageProps = {
  user: {
    id: string;
    fullName: string;
  };
  group: {
    id: string;
    name: string;
    notes: string;
    createdAt: string;
    members: {
      isAdmin: boolean;
      user: { id: string; fullName: string };
    }[];
    requests: {
      user: { id: string; fullName: string };
    }[];
    services: {
      id: string;
      name: string;
      instructions: string;
      numberOfPeople: number;
      users: {
        userId: string;
      }[];
    }[];
  };
};
const Page = ({ user, group: initialGroup }: PageProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: group } = useQuery(["group-data", initialGroup.id], (() => undefined) as any, {
    initialData: initialGroup,
    staleTime: Infinity,
  });

  const [isMember, isAdmin] = React.useMemo(() => {
    const member = group.members.find((member) => member.user.id === user.id);
    return [!!member, !!member?.isAdmin];
  }, [group.members, user.id]);

  const [isRequesting] = React.useMemo(() => {
    const request = group.requests.find((request) => request.user.id === user.id);
    return [!!request];
  }, [group.requests, user.id]);

  // Mutation
  const joinGroup = useMutation(
    async () => {
      const { payload } = await Api().post("/group/join", { groupId: group.id });
      return payload;
    },
    {
      onSuccess: (payload) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          requests: payload.requests,
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error joining group",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const joinService = useMutation(
    async (serviceId: string) => {
      const { payload } = await Api().post("/group/service/join", { groupId: group.id, serviceId });
      return payload;
    },
    {
      onSuccess: (payload) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          services: group.services.map((service) => {
            if (service.id !== payload.service.id) return service;
            return payload.service;
          }),
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error joining service",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const leaveGroup = useMutation(
    async () => {
      const { payload } = await Api().post("/group/leave", { groupId: group.id });
      return payload;
    },
    {
      onSuccess: (payload) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          // update the services to remove the decrypted instructions
          services: payload.services,
          members: payload.members,
        });

        toast({
          title: `You have left ${group.name}`,
          description: `You can send an invite to rejoin this group`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error leaving group",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const leaveService = useMutation(
    async (serviceId: string) => {
      const { payload } = await Api().post("/group/service/leave", { groupId: group.id, serviceId });
      return payload;
    },
    {
      onSuccess: (payload) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          services: group.services.map((service) => {
            if (service.id !== payload.service.id) return service;
            return payload.service;
          }),
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error leaving service",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const acceptInvite = useMutation(
    async ({ id }: { id: string; fullName: string }) => {
      const { payload } = await Api().post("/group/accept-invite", { userId: id, groupId: group.id });
      return payload;
    },
    {
      onSuccess: (payload, { fullName }) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          requests: payload.requests,
          members: payload.members,
        });

        toast({
          title: "Request accepted",
          description: `${fullName} is now part of the group`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },
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

  const removeMember = useMutation(
    async ({ id }: { id: string; fullName: string }) => {
      const { payload } = await Api().post("/group/remove-member", { userId: id, groupId: group.id });
      return payload;
    },
    {
      onSuccess: (payload, { fullName }) => {
        queryClient.setQueryData(["group-data", group.id], {
          ...group,
          members: payload.members,
        });

        toast({
          title: "User removed from group",
          description: `${fullName} has been removed from the group`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error removing member",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return (
    <Container maxW="container.lg" py={6}>
      <Stack direction="row" justifyContent="space-between">
        <chakra.div>
          <Heading fontSize="2xl" fontWeight="600" mb={1}>
            {group.name}
          </Heading>

          <Stack direction="row" alignItems="center" fontSize="sm">
            <Text color="rgb(0 0 0 / 48%)">Created on {dayjs(group.createdAt).format("DD MMM. YYYY")}</Text>
            <chakra.span color="rgb(0 0 0 / 48%)">•</chakra.span>
            <Button
              minW="0"
              px={0}
              variant="link"
              fontSize="sm"
              color="primary.400"
              _hover={{ textDecoration: "none", color: "primary.500" }}
            >
              Copy Group link
            </Button>
          </Stack>
        </chakra.div>

        <chakra.div>
          {isAdmin && (
            <Button
              size="sm"
              fontSize="sm"
              rounded="24px"
              variant="ghost"
              bgColor="primary.50"
              colorScheme="primary"
              border="1px solid transparent"
              leftIcon={<Icon as={RiEditLine} />}
              _hover={{ borderColor: "primary.600" }}
            >
              Edit Group
            </Button>
          )}

          {!isMember && (
            <Button
              fontSize="sm"
              rounded="24px"
              colorScheme="primary"
              isDisabled={isRequesting}
              isLoading={joinGroup.isLoading}
              onClick={() => joinGroup.mutate()}
              leftIcon={<Icon as={RiUserAddLine} />}
            >
              {isRequesting ? "Sent request" : "Join group"}
            </Button>
          )}

          {isMember && !isAdmin && (
            <ConfirmButton
              actionButton={{
                size: "sm",
                fontSize: "sm",
                rounded: "24px",
                variant: "ghost",
                bgColor: "primary.50",
                colorScheme: "primary",
                "aria-label": "Leave group",
                leftIcon: <IoExitOutline />,
                _hover: { borderColor: "primary.600" },
                children: "Leave group",
              }}
              confirmButton={{
                px: 4,
                fontSize: "sm",
                children: "Leave group",
                colorScheme: "primary",
                onClick: () => leaveGroup.mutate(),
                isLoading: leaveGroup.isLoading,
              }}
            >
              <Stack spacing={2}>
                <Heading fontSize="lg">Leave group</Heading>

                <Text color="rgb(0 0 0 / 65%)">Are you sure you want to leave {group.name}?</Text>
              </Stack>
            </ConfirmButton>
          )}
        </chakra.div>
      </Stack>

      <chakra.section py={6}>
        {/* services */}
        <Stack>
          <Text py={4} borderBottom="1px dashed rgb(0 0 0 / 15%)">
            Subscriptions
          </Text>

          <Stack spacing={6} py={2}>
            {group.services.map((service) => {
              const isServiceUser = !!service.users.find(({ userId }) => userId === user.id);

              return (
                <Stack key={service.id} direction="row" alignItems="center" justifyContent="space-between">
                  <Stack spacing={0}>
                    <Text textTransform="capitalize">{service.name}</Text>
                    <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                      {service.users.length}/{service.numberOfPeople} spaces available
                    </Text>
                  </Stack>

                  {isServiceUser ? (
                    <InstructionsModal serviceId={service.id} instructions={service.instructions} leaveServiceMutation={leaveService}>
                      <Button
                        size="sm"
                        aria-label="View instructions"
                        rounded="full"
                        variant="outline"
                        leftIcon={<FiEye />}
                        isDisabled={!isMember}
                        _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
                      >
                        View instructions
                      </Button>
                    </InstructionsModal>
                  ) : (
                    <Button
                      size="sm"
                      aria-label="Join service"
                      rounded="full"
                      variant="outline"
                      leftIcon={<IoAdd />}
                      isDisabled={!isMember}
                      isLoading={joinService.isLoading}
                      onClick={() => joinService.mutate(service.id)}
                      _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
                    >
                      Join service
                    </Button>
                  )}
                </Stack>
              );
            })}
          </Stack>

          {!!group.notes.length && (
            <Stack py={4} spacing={4} borderTop="1px dashed rgb(0 0 0 / 15%)">
              <Text>Note</Text>

              <Text width="75%" fontSize="sm" fontWeight="400" color="rgb(0 0 0 / 75%)">
                {group.notes}
              </Text>
            </Stack>
          )}
        </Stack>

        {/* members */}
        <Stack mt={4}>
          <Text py={4} borderBottom="1px dashed rgb(0 0 0 / 15%)">
            Members
          </Text>

          <Stack spacing={4} py={2}>
            {group.members.map((member) => (
              <Stack key={member.user.id} direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0}>
                  <Text textTransform="capitalize">{member.user.fullName}</Text>
                  {member.isAdmin && (
                    <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                      Admin
                    </Text>
                  )}
                </Stack>

                {!member.isAdmin && isAdmin && (
                  <ConfirmButton
                    actionButton={{
                      size: "sm",
                      "aria-label": "Remove member",
                      rounded: "full",
                      variant: "outline",
                      leftIcon: <IoPersonRemoveOutline />,
                      _hover: { bgColor: "primary.50", borderColor: "primary.100" },
                      children: "Remove Member",
                    }}
                    confirmButton={{
                      px: 4,
                      fontSize: "sm",
                      children: "Remove Member",
                      colorScheme: "primary",
                      onClick: () => removeMember.mutate(member.user),
                      isLoading: removeMember.isLoading,
                    }}
                  >
                    <Stack spacing={2}>
                      <Heading fontSize="lg">Remove member</Heading>

                      <Text color="rgb(0 0 0 / 65%)">Are you sure you want to remove {member.user.fullName} from this group?</Text>
                    </Stack>
                  </ConfirmButton>
                )}
              </Stack>
            ))}

            {isAdmin &&
              group.requests.map((request) => (
                <Stack key={request.user.id} direction="row" alignItems="center" justifyContent="space-between">
                  <Stack spacing={0}>
                    <Text textTransform="capitalize">{request.user.fullName}</Text>
                  </Stack>

                  <Button
                    size="sm"
                    aria-label="Accept request"
                    rounded="full"
                    variant="outline"
                    leftIcon={<RiUserAddLine />}
                    isLoading={acceptInvite.isLoading}
                    onClick={() => acceptInvite.mutate(request.user)}
                    _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
                  >
                    Accept Request
                  </Button>
                </Stack>
              ))}
          </Stack>
        </Stack>
      </chakra.section>
    </Container>
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

  const id = params?.id as string | undefined;
  if (!id) {
    return { notFound: true };
  }

  let group = await prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      notes: true,
      createdAt: true,
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
              userId: true,
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
    },
  });

  if (!group) {
    return { notFound: true };
  }

  const member = group.members.find((member) => member.user.id === req.session.data?.userId);
  const isMember = !!member;

  // decrypt services
  const services = group.services.map((service) => {
    return {
      ...service,
      instructions: isMember ? decryptData(service.instructions) : service.instructions,
    };
  });

  return {
    props: {
      user,
      group: JSON.parse(
        JSON.stringify({
          ...group,
          services,
        })
      ),

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

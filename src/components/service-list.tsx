import React from "react";
import Api from "libs/api";
import { routeReplace } from "libs/utils";
import {
  Center,
  Heading,
  Stack,
  Icon,
  Image,
  Text,
  chakra,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
  useToast,
  useEditableControls,
  Editable,
  EditablePreview,
  EditableTextarea,
  Button,
} from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";
import { FiMoreVertical, FiEdit } from "react-icons/fi";
import { IoClose, IoExitOutline } from "react-icons/io5";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "hooks/auth";

import { PageData } from "pages/app/groups/[id]";
import AddService from "components/add-service";
import EditService from "components/edit-service";
import ConfirmButton from "./confirm-button";

const InstructionTextbox = ({ isOwner }: { isOwner: boolean }) => {
  const { isEditing, getEditButtonProps } = useEditableControls();

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Text>Instructions</Text>

        {!isEditing && isOwner && (
          <IconButton
            size="sm"
            variant="ghost"
            colorScheme="primary"
            rounded="full"
            aria-label="edit instructions"
            icon={<FiEdit />}
            {...getEditButtonProps()}
          />
        )}
      </Stack>

      <EditablePreview display="block" minH={32} color="rgb(0 0 0 / 72%)" />
      <EditableTextarea minH={32} color="rgb(0 0 0 / 72%)" />
    </>
  );
};

const Service = ({ service, admin }: { service: PageData["services"][0]; admin?: PageData["members"][0] }) => {
  const toast = useToast();
  const serviceModal = useDisclosure();
  const confirmRemoveModal = useDisclosure();
  const user = useUser();

  const { query, asPath } = useRouter();

  const addedBy = service.users.find((u: any) => u.isCreator)?.user;

  const isOwner = addedBy?.id === user?.id;
  const isMember = service.users.find((u) => u.user.id === user?.id);

  const editServiceMutation = useMutation(async (data: any) => {
    return Api().post(`/groups/${query.id}/services/${service.id}/update`, data);
  });

  const removeServiceMutation = useMutation(
    async () => {
      return Api().post(`/groups/${query.id}/services/${service.id}/remove`);
    },
    {
      onSuccess: async () => {
        await routeReplace(asPath);
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

  const joinService = useMutation(
    async () => {
      await Api().post(`/groups/${query.id}/services/${service.id}/join`);
    },
    {
      onSuccess: async () => {
        await routeReplace(asPath);
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

  const leaveService = useMutation(
    async () => {
      await Api().post(`/groups/${query.id}/services/${service.id}/leave`);
    },
    {
      onSuccess: async () => {
        await routeReplace(asPath);
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

  return (
    <chakra.div>
      <Stack
        px={4}
        py={4}
        spacing={4}
        rounded="4px"
        direction="row"
        alignItems="center"
        border="1px solid rgba(58, 27, 234, 0.06)"
        _hover={{ borderColor: "rgba(58, 27, 234, 0.12)" }}
      >
        <Stack flexGrow="1" direction="row" {...(isMember ? { cursor: "pointer", onClick: () => serviceModal.onOpen() } : {})}>
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

        <Stack direction="row" alignItems="center" spacing={4}>
          <Text textTransform="uppercase" fontSize="xs" fontWeight="600">
            {service.numberOfPeople - service.users.length} Spot left
          </Text>

          {!isMember && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="primary"
              isLoading={joinService.isLoading}
              onClick={() => joinService.mutate()}
              leftIcon={<Icon as={IoIosAdd} boxSize="20px" />}
            >
              Join
            </Button>
          )}

          {isMember && !isOwner && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              isLoading={leaveService.isLoading}
              onClick={() => leaveService.mutate()}
              leftIcon={<Icon as={IoExitOutline} boxSize="20px" />}
            >
              Leave
            </Button>
          )}

          {isOwner && (
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
                  <EditService service={service}>
                    <MenuItem
                      fontSize="sm"
                      _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
                      _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
                      onClick={confirmRemoveModal.onOpen}
                    >
                      Edit subscription
                    </MenuItem>
                  </EditService>

                  <ConfirmButton
                    title="Remove Subscription"
                    Content={
                      <Text color="rgb(0 0 0 / 65%)">
                        Are you sure you want to remove this subscription? You will not be able to undo this action.
                      </Text>
                    }
                    ConfirmButton={
                      <Button
                        px={4}
                        colorScheme="red"
                        fontSize="sm"
                        isLoading={removeServiceMutation.isLoading}
                        onClick={() => removeServiceMutation.mutate()}
                      >
                        Remove Subscription
                      </Button>
                    }
                  >
                    <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                      Remove subscription
                    </MenuItem>
                  </ConfirmButton>
                </MenuList>
              </Menu>
            </chakra.div>
          )}
        </Stack>
      </Stack>

      {/* service modal */}
      <chakra.div>
        <Modal
          size="lg"
          isOpen={serviceModal.isOpen}
          onClose={serviceModal.onClose}
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
                  variant="ghost"
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

              <Editable
                isDisabled={!isOwner}
                defaultValue={service.instructions}
                onSubmit={(value) =>
                  editServiceMutation.mutate({
                    instructions: value,
                  })
                }
              >
                <InstructionTextbox isOwner={isOwner} />
              </Editable>
            </ModalBody>
          </ModalContent>
        </Modal>
      </chakra.div>
    </chakra.div>
  );
};

const ServiceList = ({ services, admin }: { services: PageData["services"]; admin?: PageData["members"][0] }) => {
  return (
    <Stack spacing={4} px={6} py={4}>
      {!!services.length ? (
        services.map((service) => <Service key={service.id} service={service} admin={admin} />)
      ) : (
        <Center h="45vh" bgColor="#fff" flexDirection="column">
          <Image src="/empty-subs.svg" alt="empty group" />

          <Heading mb={1} fontSize="2xl">
            No Subscriptions
          </Heading>

          <Text color="rgb(0 0 0 / 55%)" mb={4}>
            Click to add a new subscription
          </Text>

          <AddService fontSize="sm" colorScheme="primary" leftIcon={<Icon boxSize={5} as={IoIosAdd} />}>
            Add Subscription
          </AddService>
        </Center>
      )}
    </Stack>
  );
};

export default ServiceList;

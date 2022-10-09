import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
  Heading,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ServiceProps = {
  groupId: any;
  service: any;
  user: any;
  children: React.ReactElement;
};
const Service = ({ children, service, user, groupId }: ServiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isEditing, setEditing] = useBoolean();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [instructions, setInstructions] = React.useState(service.instructions);

  const addedBy = service.users.find((u: any) => u.isCreator)?.user;
  const isOwner = addedBy.id === user.id;

  const queryClient = useQueryClient();
  const editServiceMutation = useMutation(
    async (data: any) => {
      return Api().post("/service/update", data);
    },
    {
      onSuccess: async ({ payload }) => {
        queryClient.setQueryData(["group", groupId], (group: any) => {
          return {
            ...group,
            services: group.services.map((service: any) => {
              if (service.id !== payload.service.id) return service;

              return {
                ...service,
                ...payload,
              };
            }),
          };
        });
      },
    }
  );

  const toggleEditingState = () => {
    setEditing.toggle();

    isEditing ? textareaRef.current?.blur() : textareaRef.current?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await editServiceMutation.mutateAsync({
      id: service.id,
      instructions,
    });

    setEditing.off();
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}>
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
                onClick={() => onClose()}
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

                <Text fontSize="sm" opacity={0.6}>
                  Added by {addedBy.fullName}
                </Text>
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

            <Stack as="form" onSubmit={onSubmit} mt={2}>
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
    </>
  );
};

export default Service;

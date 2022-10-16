import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

type CreateGroupProps = {
  children: React.ReactElement;
};
const CreateGroup = ({ children }: CreateGroupProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    name: "",
  });

  const createGroupMutation = useMutation(
    async (data: any) => {
      return Api().post("/groups/create", data);
    },
    {
      onSuccess: async ({ payload }) => {
        router.push(`/app/groups/${payload.group.id}`);
      },
    }
  );

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // submit form
    await createGroupMutation.mutateAsync(formData);

    // reset and close modal
    setFormData({ name: "" });
    onClose();
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}>
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
                New Group
              </Heading>

              <IconButton
                size="sm"
                variant="ghost"
                rounded="full"
                onClick={() => onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0} pt={0} pb={4}>
            <Stack w="full" spacing={4} justifyContent="space-between" as="form" onSubmit={onSubmitForm}>
              <FormControl isInvalid={createGroupMutation.isError}>
                <FormLabel mb={1} fontSize="xs" fontWeight="600" textTransform="uppercase" opacity={0.48}>
                  Group Name
                </FormLabel>

                <Input
                  rounded="4px"
                  type="text"
                  placeholder="ex: Streaming buddies"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <FormErrorMessage>{(createGroupMutation.error as any)?.message}</FormErrorMessage>
              </FormControl>

              <chakra.div pt={6} textAlign="right">
                <Button colorScheme="primary" fontSize="sm" type="submit" isLoading={createGroupMutation.isLoading}>
                  Create Group
                </Button>
              </chakra.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroup;

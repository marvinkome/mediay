import React from "react";
import Api from "libs/api";
import {
  chakra,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { TbFileInvoice } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";

type EditGroupProps = {
  children: React.ReactElement;
  group: {
    id: string;
    name: string;
    notes: string;
    services: {
      id: string;
      name: string;
      instructions: string;
      numberOfPeople: number;
    }[];
  };
};
const EditGroup = ({ children }: EditGroupProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [formData, setFormData] = React.useState<any>({
    name: "",
    notes: "",
    services: [
      {
        name: "",
        customName: "",
        cost: "",
        numberOfPeople: "",
        instructions: "",
      },
    ],
  });

  const addNewService = () => {
    setFormData({
      ...formData,
      services: formData.services.concat({
        name: "",
        customName: "",
        cost: "",
        numberOfPeople: "",
        instructions: "",
      }),
    });
  };

  const resetInput = () => {
    setFormData({
      name: "",
      notes: "",
      services: [
        {
          name: "",
          customName: "",
          cost: "",
          numberOfPeople: "",
          instructions: "",
        },
      ],
    });
  };

  const createGroupMutation = useMutation(async (data: any) => {
    return Api().post("/group/create", data);
  });

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      services: formData.services.map((service: any) => ({
        name: service.name === "custom" ? service.customName : service.name,
        cost: Number(service.cost),
        numberOfPeople: Number(service.numberOfPeople),
        instructions: service.instructions,
      })),
    };

    // submit form
    await createGroupMutation.mutateAsync(data);

    // TODO: update groups query data

    // reset and close modal
    resetInput();
    onClose();
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent my={8} rounded="20px" overflow="hidden" maxW="container.lg">
          <ModalHeader px={4} py={2}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <IconButton
                p={0}
                top="2"
                left="4"
                size="sm"
                rounded="full"
                position="absolute"
                onClick={() => onClose()}
                bgColor="primary.50"
                aria-label="close-modal"
                _hover={{ bgColor: "primary.100" }}
                icon={<Icon boxSize="24px" as={IoMdCloseCircle} />}
              />

              <Text color="rgb(0 0 0 / 75%)">Create Group</Text>
            </Stack>
          </ModalHeader>

          <ModalBody p={0} bgColor="#FCFCFC">
            <Container maxW="container.md" py={4} as="form" onSubmit={onSubmitForm}>
              <Stack spacing={6} my={4}>
                <Stack>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="400">
                      Group name
                    </FormLabel>

                    <Input
                      fontSize="sm"
                      placeholder="Streaming buddies"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </FormControl>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={4}>
                <Text whiteSpace="nowrap" fontSize="sm" fontWeight="400">
                  Shared service
                </Text>
                <Divider borderColor="rgb(0 0 0 / 26%)" />
              </Stack>

              <Stack spacing={6} my={4} divider={<StackDivider borderColor="rgb(0 0 0 / 16%)" />}>
                {formData.services.map((service: any, idx: any) => (
                  <Stack spacing={4} key={idx}>
                    <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Service
                        </FormLabel>

                        <Select
                          fontSize="sm"
                          placeholder="Select service"
                          value={service.name}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].name = e.target.value;

                            setFormData({ ...formData, services });
                          }}
                        >
                          <option value="netflix">Netflix</option>
                          <option value="disney+">Disney+</option>
                          <option value="prime-video">Prime Video</option>
                          <option value="spotify">Spotify</option>
                          <option value="youtube">Youtube</option>
                          <option value="custom">Custom service</option>
                        </Select>

                        <FormHelperText px={2} fontSize="xs" fontWeight="400" color="gray.700">
                          Choose a pre-defined service or create a new one
                        </FormHelperText>
                      </FormControl>

                      {service.name === "custom" && (
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="400">
                            Service name
                          </FormLabel>

                          <Input
                            fontSize="sm"
                            placeholder="ACME TV"
                            value={service.customName}
                            onChange={(e) => {
                              const services = formData.services;
                              services[idx].customName = e.target.value;

                              setFormData({ ...formData, services });
                            }}
                          />
                        </FormControl>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Cost
                        </FormLabel>

                        <Input
                          fontSize="sm"
                          placeholder="0"
                          type="number"
                          min={0}
                          step=".01"
                          value={service.cost}
                          // @ts-ignore
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].cost = e.target.value;

                            setFormData({ ...formData, services });
                          }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Max Number of people
                        </FormLabel>

                        <Input
                          fontSize="sm"
                          placeholder="0"
                          type="number"
                          min={1}
                          value={service.numberOfPeople}
                          // @ts-ignore
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].numberOfPeople = e.target.value;

                            setFormData({ ...formData, services });
                          }}
                        />
                      </FormControl>
                    </Stack>

                    <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Instructions
                        </FormLabel>

                        <Textarea
                          fontSize="sm"
                          rows={3}
                          placeholder="Explain how to access this service, including credentials to the service"
                          value={service.instructions}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].instructions = e.target.value;

                            setFormData({ ...formData, services });
                          }}
                        />

                        <FormHelperText px={2} fontSize="xs" fontWeight="400" color="gray.700">
                          The group instructions will be stored securely, and would be only available to people who have access to the
                          group.
                        </FormHelperText>
                      </FormControl>
                    </Stack>

                    {formData.services.length > 1 && (
                      <chakra.div>
                        <Button
                          variant="ghost"
                          fontWeight="500"
                          size="sm"
                          fontSize="sm"
                          colorScheme="red"
                          leftIcon={<Icon as={FiTrash2} />}
                          rounded="xl"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              services: formData.services.filter((_: any, id: any) => id !== idx),
                            })
                          }
                        >
                          Remove Service
                        </Button>
                      </chakra.div>
                    )}
                  </Stack>
                ))}
              </Stack>

              <Stack my={4} direction="row" alignItems="center" spacing={4}>
                <chakra.div>
                  <Button
                    variant="outline"
                    fontWeight="500"
                    size="sm"
                    fontSize="sm"
                    leftIcon={<Icon as={FiPlus} />}
                    rounded="xl"
                    onClick={() => addNewService()}
                  >
                    Add Service
                  </Button>
                </chakra.div>

                <Divider borderColor="rgb(0 0 0 / 26%)" />
              </Stack>

              <Stack my={6}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="400">
                    Notes
                  </FormLabel>

                  <Textarea
                    fontSize="sm"
                    rows={3}
                    placeholder="Any extra notes for the group"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </FormControl>
              </Stack>

              <Stack my={6} spacing={2}>
                <Stack direction="row" alignItems="center" spacing={4}>
                  <Button
                    fontWeight="600"
                    size="md"
                    fontSize="sm"
                    rounded="xl"
                    colorScheme="primary"
                    leftIcon={<TbFileInvoice />}
                    type="submit"
                    isLoading={createGroupMutation.isLoading}
                  >
                    Create Group
                  </Button>

                  <Button
                    variant="ghost"
                    color="initial"
                    fontWeight="600"
                    size="md"
                    fontSize="sm"
                    rounded="xl"
                    colorScheme="primary"
                    onClick={() => resetInput()}
                  >
                    Reset
                  </Button>
                </Stack>

                {createGroupMutation.isError && (
                  <Text color="red.500" fontSize="sm">
                    {(createGroupMutation.error as any)?.message}
                  </Text>
                )}
              </Stack>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditGroup;

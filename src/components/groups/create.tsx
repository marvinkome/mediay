import React from "react";
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

const isPresent = (value: any) => {
  return value !== null && value !== undefined && typeof value === "string" && value.trim().length > 0;
};

type CreateInvoiceProps = {
  children: React.ReactElement;
};
export const CreateInvoice = ({ children }: CreateInvoiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [client, setClient] = React.useState<string>();
  const [clientDetails, setClientDetails] = React.useState({
    name: "",
    address: "",
  });

  const [formData, setFormData] = React.useState<any>({
    issueDate: null,
    dueDate: null,
    payoutAddress: "",
    services: [
      {
        title: "",
        cost: 0,
        description: "",
      },
    ],
  });

  const [dateErrors, setDateErrors] = React.useState<any[]>([]);
  const dateValidator: any = {
    issueDate: isPresent,
    dueDate: isPresent,
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // validate date
    setDateErrors([]);
    const dateFieldsWithError = Object.keys(dateValidator).filter((field) => {
      const validator = dateValidator[field];
      return !validator(formData[field]);
    });
    if (dateFieldsWithError.length) {
      setDateErrors(dateFieldsWithError);
      return;
    }

    // submit form
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
            <Container maxW="container.md" py={8} as="form" onSubmit={onSubmitForm}>
              <Stack spacing={6} my={6}>
                <Stack>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="400">
                      Group name
                    </FormLabel>

                    <Input fontSize="sm" placeholder="Groupies" />
                  </FormControl>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={4}>
                <Text whiteSpace="nowrap" fontSize="sm" fontWeight="400">
                  Shared service
                </Text>
                <Divider borderColor="rgb(0 0 0 / 26%)" />
              </Stack>

              <Stack spacing={6} my={6} divider={<StackDivider borderColor="rgb(0 0 0 / 16%)" />}>
                {formData.services.map((service: any, idx: any) => (
                  <Stack spacing={4} key={idx}>
                    <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Service
                        </FormLabel>

                        <Select fontSize="sm" placeholder="Select service" value={client} onChange={(e) => setClient(e.target.value)}>
                          <option value="netflix">Netflix</option>
                          <option value="disney+">Disney+</option>
                          <option value="prime-video">Prime Video</option>
                          <option value="spotify">Spotify</option>
                          <option value="youtube">Youtube</option>
                          <option value="create">Custom service</option>
                        </Select>

                        <FormHelperText px={2} fontSize="xs" fontWeight="400" color="gray.700">
                          Choose a pre-defined service or create a new one
                        </FormHelperText>
                      </FormControl>

                      {false && (
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="400">
                            Service name
                          </FormLabel>

                          <Input
                            fontSize="sm"
                            placeholder="ACME TV"
                            value={service.title}
                            onChange={(e) => {
                              const services = formData.services;
                              services[idx].title = e.target.value;

                              setFormData({ ...formData, services });
                            }}
                          />
                        </FormControl>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Total Cost
                        </FormLabel>

                        <Input
                          fontSize="sm"
                          placeholder="0"
                          type="number"
                          value={service.cost}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].cost = e.target.value;

                            setFormData({ ...formData, services });
                          }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="400">
                          Number of people
                        </FormLabel>

                        <Input
                          fontSize="sm"
                          placeholder="0"
                          type="number"
                          value={service.cost}
                          onChange={(e) => {
                            const services = formData.services;
                            services[idx].cost = e.target.value;

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
                          rows={4}
                          placeholder="Explain how to use this service"
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

              <Stack my={6} direction="row" alignItems="center" spacing={4}>
                <chakra.div>
                  <Button
                    variant="outline"
                    fontWeight="500"
                    size="sm"
                    fontSize="sm"
                    leftIcon={<Icon as={FiPlus} />}
                    rounded="xl"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        services: formData.services.concat({ title: "", cost: 0, description: "" }),
                      })
                    }
                  >
                    Add Service
                  </Button>
                </chakra.div>

                <Divider borderColor="rgb(0 0 0 / 26%)" />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={4} my={6}>
                <Button
                  fontWeight="600"
                  size="md"
                  fontSize="sm"
                  rounded="xl"
                  colorScheme="primary"
                  leftIcon={<TbFileInvoice />}
                  type="submit"
                >
                  Create Group
                </Button>

                <Button variant="ghost" color="initial" fontWeight="600" size="md" fontSize="sm" rounded="xl" colorScheme="primary">
                  Reset
                </Button>
              </Stack>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateInvoice;

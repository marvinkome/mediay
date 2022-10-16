import React from "react";
import Api from "libs/api";
import {
  chakra,
  Button,
  ButtonProps,
  FormControl,
  FormHelperText,
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
  Select,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { routeReplace } from "libs/utils";

type AddServiceProps = ButtonProps & {
  children: React.ReactNode;
};
const AddService = ({ children, ...props }: AddServiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { query, asPath } = useRouter();

  const [formData, setFormData] = React.useState({
    name: "",
    customName: "",
    cost: "",
    numberOfPeople: "",
    instructions: "",
  });

  const resetInput = () => {
    setFormData({
      name: "",
      customName: "",
      cost: "",
      numberOfPeople: "",
      instructions: "",
    });
  };

  const addServiceMutation = useMutation(
    async (data: any) => {
      return Api().post(`/groups/${query.id}/services/add`, data);
    },
    {
      onSuccess: async () => {
        await routeReplace(asPath);
      },
    }
  );

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name === "custom" ? formData.customName : formData.name,
      cost: Number(formData.cost),
      numberOfPeople: Number(formData.numberOfPeople),
      instructions: formData.instructions,
    };

    // submit form
    await addServiceMutation.mutateAsync(data);

    // reset and close modal
    resetInput();
    onClose();
  };

  return (
    <chakra.div>
      <Button onClick={() => onOpen()} {...props}>
        {children}
      </Button>

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
                Add Subscription
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

          <ModalBody px={0} pt={0} pb={4} as="form" onSubmit={onSubmitForm}>
            <Stack spacing={4} mb={10}>
              <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="center">
                <FormControl isRequired>
                  <FormLabel mb={1} opacity="0.68" fontSize="sm" fontWeight="600">
                    Service
                  </FormLabel>

                  <Select
                    fontSize="sm"
                    placeholder="Select service"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  >
                    <option value="netflix">Netflix</option>
                    <option value="disney+">Disney+</option>
                    <option value="prime video">Prime Video</option>
                    <option value="spotify">Spotify</option>
                    <option value="youtube">Youtube</option>
                    <option value="custom">Custom service</option>
                  </Select>
                </FormControl>

                {formData.name === "custom" && (
                  <FormControl isRequired>
                    <FormLabel mb={1} opacity="0.68" fontSize="sm" fontWeight="600">
                      Service name
                    </FormLabel>

                    <Input
                      fontSize="sm"
                      placeholder="ACME TV"
                      value={formData.customName}
                      onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                    />
                  </FormControl>
                )}
              </Stack>

              <Stack>
                <FormControl isRequired>
                  <FormLabel mb={1} opacity={0.68} fontSize="sm" fontWeight="600">
                    Total Cost
                  </FormLabel>

                  <Input
                    fontSize="sm"
                    placeholder="0"
                    type="number"
                    min={0}
                    step=".01"
                    // @ts-ignore
                    onWheel={(e) => e.target.blur()}
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </FormControl>
              </Stack>

              <Stack>
                <FormControl isRequired>
                  <FormLabel mb={1} opacity={0.68} fontSize="sm" fontWeight="600">
                    Max number of people
                  </FormLabel>

                  <Input
                    fontSize="sm"
                    placeholder="0"
                    type="number"
                    min={0}
                    step=".01"
                    // @ts-ignore
                    onWheel={(e) => e.target.blur()}
                    value={formData.numberOfPeople}
                    onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
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
                    placeholder="Provide login details and more details"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  />

                  <FormHelperText opacity={0.68} fontSize="xs" fontWeight="400" color="gray.700">
                    Instructions will be stored securely and only accessible to group members.
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={4}>
              <Text flexGrow={1} fontSize="sm" color="red.500">
                {(addServiceMutation.error as any)?.message}
              </Text>

              <Button variant="ghost" color="initial" fontWeight="600" size="md" fontSize="sm" colorScheme="primary">
                Reset
              </Button>

              <Button
                px={6}
                fontWeight="600"
                size="md"
                fontSize="sm"
                colorScheme="primary"
                type="submit"
                isLoading={addServiceMutation.isLoading}
              >
                Add Subscription
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </chakra.div>
  );
};

export default AddService;

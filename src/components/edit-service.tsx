import React from "react";
import Api from "libs/api";
import {
  Button,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

type EditServiceProps = {
  service: any;
  children: React.ReactElement;
};
const EditService = ({ children, service }: EditServiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryClient = useQueryClient();

  const { query } = useRouter();

  const [formData, setFormData] = React.useState({
    name: service.name,
    customName: "",
    cost: service.cost,
    numberOfPeople: service.numberOfPeople,
    instructions: service.instructions,
  });

  const editServiceMutation = useMutation(
    async (data: any) => {
      return Api().post(`/groups/${query.id}/services/update`, data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["services", query.id]);
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
    await editServiceMutation.mutateAsync({
      id: service.id,
      ...data,
    });

    // reset and close modal
    onClose();
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
                Edit Subscription
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
                    <option value="prime-video">Prime Video</option>
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
                {(editServiceMutation.error as any)?.message}
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
                isLoading={editServiceMutation.isLoading}
              >
                Edit Subscription
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditService;

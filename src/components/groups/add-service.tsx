import React from "react";
import {
  Button,
  chakra,
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
import service from "./service";

type AddServiceProps = {
  children: React.ReactElement;
};
const AddService = ({ children }: AddServiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

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
                Add Subscription
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

          <ModalBody px={0} pt={0} pb={4}>
            <Stack spacing={4} mb={10}>
              <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                <FormControl isRequired>
                  <FormLabel mb={1} opacity="0.68" fontSize="sm" fontWeight="600">
                    Service
                  </FormLabel>

                  <Select fontSize="sm" placeholder="Select service">
                    <option value="netflix">Netflix</option>
                    <option value="disney+">Disney+</option>
                    <option value="prime-video">Prime Video</option>
                    <option value="spotify">Spotify</option>
                    <option value="youtube">Youtube</option>
                    <option value="custom">Custom service</option>
                  </Select>
                </FormControl>

                {service.name === "custom" && (
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="400">
                      Service name
                    </FormLabel>

                    <Input fontSize="sm" placeholder="ACME TV" />
                  </FormControl>
                )}
              </Stack>

              <Stack>
                <FormControl isRequired>
                  <FormLabel mb={1} opacity={0.68} fontSize="sm" fontWeight="600">
                    Cost
                  </FormLabel>

                  <Input
                    fontSize="sm"
                    placeholder="0"
                    type="number"
                    min={0}
                    step=".01"
                    // @ts-ignore
                    onWheel={(e) => e.target.blur()}
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
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={8} justifyContent="space-between" alignItems="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="400">
                    Instructions
                  </FormLabel>

                  <Textarea fontSize="sm" rows={4} placeholder="Provide login details and more details" />

                  <FormHelperText opacity={0.68} fontSize="xs" fontWeight="400" color="gray.700">
                    Instructions will be stored securely and only accessible to group members.
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={4}>
              <Text flexGrow="1" fontSize="sm" color="red.500">
                Error saving group information and a very long text
              </Text>

              <Button variant="ghost" color="initial" fontWeight="600" size="md" fontSize="sm" colorScheme="primary">
                Reset
              </Button>

              <Button px={6} fontWeight="600" size="md" fontSize="sm" colorScheme="primary">
                Add Subscription
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddService;

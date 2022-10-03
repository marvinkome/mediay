import React from "react";
import {
  Button,
  chakra,
  FormControl,
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
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { RiCheckLine } from "react-icons/ri";

type AccountProps = {
  children: React.ReactElement;
};
const Account = ({ children }: AccountProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

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
                Profile
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
            <Stack w="full" spacing={4}>
              <FormControl>
                <FormLabel mb={1} fontSize="xs" fontWeight="600" textTransform="uppercase" opacity={0.48}>
                  Name
                </FormLabel>

                <Input rounded="4px" type="text" placeholder="John Doe" />
              </FormControl>

              <FormControl>
                <FormLabel mb={1} fontSize="xs" fontWeight="600" textTransform="uppercase" opacity={0.48}>
                  Email
                </FormLabel>

                <Input rounded="4px" type="email" placeholder="John Doe" />
              </FormControl>

              <chakra.div pt={6} textAlign="right">
                <Button colorScheme="primary" fontSize="sm" leftIcon={<Icon as={RiCheckLine} />}>
                  Update profile
                </Button>
              </chakra.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Account;

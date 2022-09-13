import React from "react";
import {
  Button,
  chakra,
  Container,
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
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdCloseCircle } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";

type SignupProps = {
  children: React.ReactElement;
};
const Signup = ({ children }: SignupProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm" scrollBehavior="inside">
        <ModalOverlay />

        <ModalContent my={8} rounded="20px" overflow="hidden" maxW="md">
          <ModalHeader px={4} py={2}>
            <Stack direction="row" alignItems="center">
              <IconButton
                p={0}
                size="sm"
                rounded="full"
                onClick={() => onClose()}
                bgColor="primary.50"
                aria-label="close-modal"
                _hover={{ bgColor: "primary.100" }}
                icon={<Icon boxSize="24px" as={IoMdCloseCircle} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody p={0}>
            <Container maxW="sm" py={0}>
              <Stack textAlign="center">
                <Heading fontSize="xl">Log in or sign up in seconds</Heading>

                <Text fontSize="sm" color="rgb(0 0 0 / 48%)">
                  Use your email or another service to continue with Mediay
                </Text>
              </Stack>

              <Stack my={8} spacing={4}>
                <Button variant="outline" fontSize="sm" colorScheme="primary" leftIcon={<Icon boxSize="20px" as={FcGoogle} />}>
                  <chakra.span lineHeight="none">Continue with Google</chakra.span>
                </Button>

                <Button
                  variant="outline"
                  fontSize="sm"
                  colorScheme="primary"
                  leftIcon={<Icon boxSize="22" as={ImAppleinc} color="black" />}
                >
                  <chakra.span lineHeight="none">Continue with Apple</chakra.span>
                </Button>

                <Text fontSize="xs" fontWeight="600" textAlign="center" color="rgb(0 0 0 / 68%)">
                  OR
                </Text>

                <Stack as="form">
                  <FormControl isRequired>
                    <Input fontSize="sm" placeholder="Your email" />
                  </FormControl>

                  <Button colorScheme="primary" fontSize="sm">
                    Continue with Email
                  </Button>
                  {/* <Text fontSize="sm">
                    We've sent a link to you at <chakra.span fontWeight="600">marvinkome@gmail.com</chakra.span> it contains a link to
                    continue.
                  </Text> */}
                </Stack>

                <Text fontSize="sm" color="rgb(0 0 0 / 48%)">
                  By continuing, you agree to our Terms of Use and our Privacy Policy.
                </Text>
              </Stack>
            </Container>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Signup;

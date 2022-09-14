import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
  Container,
  Divider,
  FormControl,
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
import { useOAuth } from "hooks/auth";
import { useMutation } from "@tanstack/react-query";
import supabase from "libs/supabase";

type SignupProps = {
  children: React.ReactElement;
};
const Auth = ({ children }: SignupProps) => {
  const [email, setEmail] = React.useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

  // oauth login
  const googleAuthSignIn = useOAuth({ provider: "google" });
  const googleAuthMutation = useMutation(async () => {
    const data = await googleAuthSignIn();
    return Api().post("/auth", data);
  });

  // email login
  const emailAuthMutation = useMutation(async (data: any) => {
    return await supabase.auth.signIn(data, {
      shouldCreateUser: true,
      redirectTo: "http://localhost:3000/email-callback",
    });
  });
  const onEmailSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();

    emailAuthMutation.mutate({ email });
  };

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
                <Stack>
                  <Button
                    variant="outline"
                    fontSize="sm"
                    colorScheme="primary"
                    leftIcon={<Icon boxSize="20px" as={FcGoogle} />}
                    onClick={() => googleAuthMutation.mutate()}
                    isLoading={googleAuthMutation.isLoading}
                    {...(googleAuthMutation.isError ? { borderColor: "red.600" } : {})}
                  >
                    <chakra.span lineHeight="none">Continue with Google</chakra.span>
                  </Button>
                  {googleAuthMutation.isError && (
                    <Text color="red.600" fontSize="xs">
                      Error authenticating with Google. Please try again or use a different option
                    </Text>
                  )}
                </Stack>

                <Button
                  variant="outline"
                  fontSize="sm"
                  colorScheme="primary"
                  leftIcon={<Icon boxSize="22" as={ImAppleinc} color="black" />}
                >
                  <chakra.span lineHeight="none">Continue with Apple</chakra.span>
                </Button>

                <Divider />

                <Stack as="form" onSubmit={onEmailSubmit}>
                  {emailAuthMutation.isSuccess ? (
                    <Text fontSize="sm">
                      We&apos;ve sent an email to <chakra.span fontWeight="600">{email}</chakra.span>, it contains a link to continue.
                    </Text>
                  ) : (
                    <>
                      <FormControl isRequired>
                        <Input
                          type="email"
                          name="email"
                          fontSize="sm"
                          placeholder="Your email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormControl>

                      <Button colorScheme="primary" fontSize="sm" type="submit" isLoading={emailAuthMutation.isLoading}>
                        Continue with Email
                      </Button>

                      {emailAuthMutation.isError && (
                        <Text color="red.600" fontSize="xs">
                          Error authenticating with Email. Please try again or use a different option
                        </Text>
                      )}
                    </>
                  )}
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

export default Auth;

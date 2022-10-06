import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Image,
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
import { motion } from "framer-motion";
import { IoMdCloseCircle } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useOAuth } from "hooks/auth";
import { useMutation } from "@tanstack/react-query";
import supabase from "libs/supabase";
import { IoClose } from "react-icons/io5";

const MotionFormControl = motion(FormControl);

type SignupProps = {
  children: React.ReactElement;
};
const Auth = ({ children }: SignupProps) => {
  const [isSignup, setIsSignup] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

  // oauth login
  const googleAuthSignIn = useOAuth({ provider: "google" });
  const googleAuthMutation = useMutation(async () => {
    const data = await googleAuthSignIn();
    return Api().post("/auth", data);
  });

  // email login
  const emailAuthMutation = useMutation(async (data: any) => {
    if (!isSignup) {
      const { payload } = await Api().get(`/auth?email=${data.email}`);
      if (!payload.exists) {
        setIsSignup(true);
        throw new Error("no-account");
      }
    }

    // signin
    const { error } = await supabase.auth.signIn(data, {
      shouldCreateUser: true,
      // HACK:: Supabase doesn't allow signIn with extra data, so we pass the fullName as query params
      // so it can be used from the callback link
      redirectTo: `http://localhost:3000/email-callback?full_name=${encodeURIComponent(fullName)}`,
    });

    if (error) throw error;
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

        <ModalContent my={8} mx={10} overflow="hidden" maxW="md">
          <ModalHeader px={6} py={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Image src="/logo-gray.svg" alt="logo" boxSize="30px" />

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

          <ModalBody p={0}>
            <Container maxW="sm" py={0}>
              <Stack textAlign="center">
                <Heading fontSize="xl">Sign up or Log in to continue</Heading>
              </Stack>

              <Stack my={8} spacing={2}>
                <Stack as="form" spacing={4} onSubmit={onEmailSubmit}>
                  {emailAuthMutation.isSuccess ? (
                    <Text fontSize="sm">
                      We&apos;ve sent an email to <chakra.span fontWeight="600">{email}</chakra.span>, it contains a link to continue.
                    </Text>
                  ) : (
                    <>
                      {isSignup && (
                        <MotionFormControl initial={{ y: 20 }} animate={{ y: 0 }} isRequired>
                          <FormLabel
                            mb={1}
                            fontSize="xs"
                            opacity={0.48}
                            fontWeight="600"
                            textTransform="uppercase"
                            requiredIndicator={<span />}
                          >
                            Name
                          </FormLabel>

                          <Input
                            type="text"
                            name="name"
                            fontSize="sm"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </MotionFormControl>
                      )}

                      <FormControl isRequired>
                        <FormLabel
                          mb={1}
                          fontSize="xs"
                          opacity={0.48}
                          fontWeight="600"
                          textTransform="uppercase"
                          requiredIndicator={<span />}
                        >
                          Email
                        </FormLabel>

                        <Input
                          type="email"
                          name="email"
                          fontSize="sm"
                          placeholder="johndoe@mail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormControl>

                      <Button colorScheme="secondary" fontSize="sm" type="submit" py={3} isLoading={emailAuthMutation.isLoading}>
                        Sign Up
                      </Button>

                      {emailAuthMutation.isError && (emailAuthMutation.error as any)?.message !== "no-account" && (
                        <Text color="red.600" fontSize="xs">
                          Error authenticating with Email. Please try again or use a different option
                        </Text>
                      )}
                    </>
                  )}
                </Stack>

                <Text textAlign="center" fontSize="xs" color="rgb(0 0 0 / 58%)">
                  OR
                </Text>

                <Stack>
                  <Button
                    variant="outline"
                    fontSize="sm"
                    colorScheme="secondary"
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

                <Text fontSize="xs" color="rgb(0 0 0 / 58%)">
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

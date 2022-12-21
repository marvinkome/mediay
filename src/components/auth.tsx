import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
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
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useOath2Login } from "libs/react-oauth2";
import { useMutation } from "@tanstack/react-query";
import supabase from "libs/supabase";
import { IoClose } from "react-icons/io5";

const MotionFormControl = motion(FormControl);

const appUrl = process.env.NEXT_PUBLIC_URL;
if (!appUrl) {
  throw new Error("NEXT_PUBLIC_URL env variable not set");
}

type AuthContainerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
export const AuthContainer = ({ isOpen, onClose, children }: AuthContainerProps) => {
  return (
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
            <Image src="/logo-gray.svg" alt="logo" boxSize="30px" />

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

        <ModalBody px={2} pt={0} pb={4}>
          <Stack textAlign="center">
            <Heading fontSize="xl" fontWeight="600">
              Sign up or Log in to continue
            </Heading>
          </Stack>

          <Stack my={8} spacing={2}>
            {children}

            <Text fontSize="xs" color="rgb(0 0 0 / 58%)">
              By continuing, you agree to our Terms of Use and our Privacy Policy.
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type EmailAuthProps = {
  auth: (data: { email: string; fullName: string }) => Promise<void>;
};
export const EmailAuth = ({ auth }: EmailAuthProps) => {
  const [isSignup, setIsSignup] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");

  const emailAuthMutation = useMutation(async (data: any) => {
    if (!isSignup) {
      const { payload } = await Api().get(`/auth?email=${data.email}`);
      if (!payload.exists) {
        setIsSignup(true);
        throw new Error("no-account");
      }
    }

    await auth(data);
  });

  const onEmailSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();
    emailAuthMutation.mutate({ email, fullName });
  };

  return (
    <Stack as="form" spacing={4} onSubmit={onEmailSubmit}>
      {emailAuthMutation.isSuccess ? (
        <Text>
          We&apos;ve sent an email to <chakra.span fontWeight="600">{email}</chakra.span>, it contains a link to continue.
        </Text>
      ) : (
        <>
          {isSignup && (
            <MotionFormControl initial={{ y: 20 }} animate={{ y: 0 }} isRequired>
              <FormLabel mb={1} fontSize="xs" opacity={0.48} fontWeight="600" textTransform="uppercase" requiredIndicator={<span />}>
                Name
              </FormLabel>

              <Input type="text" name="name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </MotionFormControl>
          )}

          <FormControl isRequired>
            <FormLabel mb={1} fontSize="xs" opacity={0.48} fontWeight="600" textTransform="uppercase" requiredIndicator={<span />}>
              Email
            </FormLabel>

            <Input type="email" name="email" placeholder="johndoe@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <Button colorScheme="secondary" fontSize="sm" type="submit" py={3} isLoading={emailAuthMutation.isLoading}>
            Continue
          </Button>

          {emailAuthMutation.isError && (emailAuthMutation.error as any)?.message !== "no-account" && (
            <Text color="red.600" fontSize="xs">
              Error authenticating with Email. Please try again or use a different option
            </Text>
          )}
        </>
      )}
    </Stack>
  );
};

type GoogleAuthProps = {
  auth: (data: any) => void;
};
export const GoogleAuth = ({ auth }: GoogleAuthProps) => {
  // google login
  const url = React.useMemo(() => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    }).toString();

    return `${url}?${params}`;
  }, []);

  const googleSignIn = useOath2Login({ id: "google-login", url });
  const googleAuthMutation = useMutation(async () => {
    const data = await googleSignIn();
    return auth(data);
  });

  return (
    <Stack>
      <Button
        variant="ghost"
        fontSize="sm"
        colorScheme="secondary"
        leftIcon={<Icon boxSize="20px" as={FcGoogle} />}
        onClick={() => googleAuthMutation.mutate()}
        isLoading={googleAuthMutation.isLoading}
      >
        <chakra.span lineHeight="none">Continue with Google</chakra.span>
      </Button>

      {googleAuthMutation.isError && (
        <Text color="red.600" fontSize="xs">
          Error authenticating with Google. Please try again or use a different option
        </Text>
      )}
    </Stack>
  );
};

type SignupProps = {
  children: React.ReactElement;
};
const Auth = ({ children }: SignupProps) => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // google login
  const googleAuth = async (data: any) => {
    await Api().post("/google-auth", data);
    router.push("/app");
  };

  // email login
  const emailAuth = async (data: { email: string; fullName?: string }) => {
    const { error } = await supabase.auth.signIn(
      { email: data.email },
      {
        shouldCreateUser: true,
        // HACK:: Supabase doesn't allow signIn with extra data, so we pass the fullName as query params
        // so it can be used from the callback link
        redirectTo: `${appUrl}/email-callback?full_name=${encodeURIComponent(data?.fullName || "")}`,
      }
    );

    if (error) throw error;
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <AuthContainer isOpen={isOpen} onClose={onClose}>
        <EmailAuth auth={emailAuth} />

        <Text textAlign="center" fontSize="xs" color="rgb(0 0 0 / 58%)">
          OR
        </Text>

        <GoogleAuth auth={googleAuth} />
      </AuthContainer>
    </>
  );
};

export default Auth;

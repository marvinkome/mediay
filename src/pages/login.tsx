import React from "react";
import Api from "libs/api";
import supabase from "libs/supabase";
import NextLink from "next/link";
import { Container, Stack, Heading, Button, Icon, chakra, FormControl, FormLabel, Input, Text, Center, Link } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { useOAuth } from "hooks/auth";

const Page = () => {
  const [email, setEmail] = React.useState("");

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
    <Center bgColor="#FCFCFC" minH="100vh">
      <Container maxW="sm" py={6} px={6} bgColor="#fff" shadow="base" rounded="2xl">
        <Stack textAlign="center">
          <Heading fontSize="xl">Log in to Mediay</Heading>

          <Text fontSize="sm" color="rgb(0 0 0 / 48%)">
            Use your email or another service to continue
          </Text>
        </Stack>

        <Stack mt={8} spacing={4}>
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

          <Text textAlign="center" fontSize="xs" color="rgb(0 0 0 / 58%)">
            OR
          </Text>

          <Stack as="form" spacing={3} onSubmit={onEmailSubmit}>
            {emailAuthMutation.isSuccess ? (
              <Text fontSize="sm">
                We&apos;ve sent an email to <chakra.span fontWeight="600">{email}</chakra.span>, it contains a link to continue.
              </Text>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel mb={1} fontSize="xs" fontWeight="400" requiredIndicator={<span />}>
                    Email address
                  </FormLabel>

                  <Input type="email" name="email" fontSize="sm" placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
                </FormControl>

                <Button colorScheme="primary" fontSize="sm" type="submit" isLoading={emailAuthMutation.isLoading}>
                  Continue with Email
                </Button>

                {emailAuthMutation.isError && (
                  <Text color="red.600" fontSize="xs">
                    Error authenticating with Email. Please try again or use a different option
                  </Text>
                )}

                <Text textAlign="center" fontSize="xs" color="rgb(0 0 0 / 48%)">
                  By continuing, you agree to our Terms of Use and our Privacy Policy.
                </Text>
              </>
            )}
          </Stack>

          <Text textAlign="center" fontSize="sm" color="rgb(0 0 0 / 68%)">
            Don&apos;t have an account?{" "}
            <NextLink href="/signup" passHref>
              <Link textDecoration="underline" fontWeight="600">
                Sign up
              </Link>
            </NextLink>
          </Text>
        </Stack>
      </Container>
    </Center>
  );
};

// Page.Layout = LandingPageLayout;
export default Page;

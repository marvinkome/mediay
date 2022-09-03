import React from "react";
import Api from "libs/api";
import { Button, chakra, Container, Heading, Stack, StackDivider, useToast } from "@chakra-ui/react";
import { useGoogleSignIn } from "hooks/auth";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
  const toast = useToast();
  const googleSignIn = useGoogleSignIn();

  const googleAuth = useMutation(
    async () => {
      const data = await googleSignIn();

      return Api().post("/signup/google", {
        code: decodeURIComponent(data.code),
      });
    },
    {
      onError: (err: any) => {
        toast({
          title: "Error login in",
          description: err?.message,
          position: "bottom-right",
          status: "error",
        });
      },
    }
  );

  return (
    <chakra.div bgColor="gray.100" minH="100vh" py={40}>
      <Container maxW="lg" bgColor="#fff" rounded="xl" shadow="base" py={4} px={6}>
        <Heading fontSize="2xl">Get started!</Heading>

        <Stack mt={8} divider={<StackDivider />}>
          <Button variant="outline" isLoading={googleAuth.isLoading} onClick={() => googleAuth.mutate()}>
            Sign up with Google
          </Button>
        </Stack>
      </Container>
    </chakra.div>
  );
};

export default Page;

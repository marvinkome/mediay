import React from "react";
import NextLink from "next/link";
import { Button, chakra, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import CreateGroup from "components/groups/modals/create";

type AppLayoutProps = {
  children: React.ReactElement;
  user: { fullName?: string };
};
const AppLayout = ({ children, user }: AppLayoutProps) => {
  return (
    <chakra.div bgColor="#FCFCFC" minH="100vh">
      <chakra.header bgColor="#fff">
        <Container maxW="container.lg">
          <Stack py={5} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={4}>
              <Heading fontSize="2xl" fontWeight="800" color="primary.500">
                Mediay
              </Heading>
            </Stack>

            {user.fullName && (
              <NextLink href="/app/account" passHref>
                <Button
                  as="a"
                  rounded="2xl"
                  px={4}
                  py={1}
                  h="auto"
                  bgColor="primary.50"
                  _hover={{ bgColor: "primary.100" }}
                  _active={{ bgColor: "primary.100" }}
                  onClick={() => null}
                >
                  {user.fullName}
                </Button>
              </NextLink>
            )}
          </Stack>
        </Container>
      </chakra.header>

      <Container maxW="container.lg">
        <Stack direction="row" mt={20} spacing={6} alignItems="flex-start">
          <chakra.aside py={6} px={4} flex="1" rounded="2rem" bgColor="#fff" border="1px solid" borderColor="rgb(0 0 0 / 4%)">
            <Stack mb={4} spacing={4} alignItems="flex-start">
              <NextLink href="/app" passHref>
                <Button as="a" variant="ghost" color="initial" fontSize="sm" rounded="full" colorScheme="primary">
                  All Groups
                </Button>
              </NextLink>

              <NextLink href="/app/received" passHref>
                <Button as="a" variant="ghost" color="initial" fontSize="sm" rounded="full" colorScheme="primary">
                  Created Groups
                </Button>
              </NextLink>

              <NextLink href="/app/pending" passHref>
                <Button as="a" variant="ghost" color="initial" fontSize="sm" rounded="full" colorScheme="primary">
                  Joined Groups
                </Button>
              </NextLink>
            </Stack>

            <CreateGroup>
              <Button w="full" leftIcon={<FiPlus />} fontSize="sm" rounded="full" colorScheme="primary" variant="outline">
                Create Group
              </Button>
            </CreateGroup>
          </chakra.aside>

          <chakra.main flex="4">{children}</chakra.main>
        </Stack>
      </Container>
    </chakra.div>
  );
};

export default AppLayout;

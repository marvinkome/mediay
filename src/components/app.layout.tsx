import React from "react";
import NextLink from "next/link";
import { Button, chakra, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import CreateGroup from "components/groups/create";

const AppLayout = ({ children }: any) => {
  return (
    <chakra.div bgColor="#FCFCFC" minH="100vh">
      <chakra.header bgColor="#fff">
        <Container maxW="container.lg">
          <Stack py={5} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={4}>
              <Heading fontSize="2xl" fontWeight="800">
                Mediay
              </Heading>
            </Stack>

            <NextLink href="/app/account" passHref>
              <Button
                as="a"
                rounded="2xl"
                px={4}
                py={1}
                h="auto"
                bgColor="rgb(0 0 0 / 8%)"
                _hover={{ bgColor: "rgb(0 0 0 / 12%)" }}
                _active={{ bgColor: "rgb(0 0 0 / 12%)" }}
                onClick={() => null}
              >
                Marvin
              </Button>
            </NextLink>
          </Stack>
        </Container>
      </chakra.header>

      <Container maxW="container.lg">
        <Stack direction="row" mt={20} spacing={6} alignItems="flex-start">
          <chakra.aside py={6} px={4} flex="1" rounded="2rem" bgColor="#fff" border="1px solid" borderColor="rgb(0 0 0 / 4%)">
            <Stack mb={8} spacing={4} alignItems="flex-start">
              <NextLink href="/app" passHref>
                <Button as="a" variant="ghost" fontWeight="500" fontSize="md" rounded="full" _hover={{ bgColor: "rgb(0 0 0 / 8%)" }}>
                  All Groups
                </Button>
              </NextLink>

              <NextLink href="/app/received" passHref>
                <Button as="a" variant="ghost" fontWeight="500" fontSize="md" rounded="full" _hover={{ bgColor: "rgb(0 0 0 / 8%)" }}>
                  Created Groups
                </Button>
              </NextLink>

              <NextLink href="/app/pending" passHref>
                <Button as="a" variant="ghost" fontWeight="500" fontSize="md" rounded="full" _hover={{ bgColor: "rgb(0 0 0 / 8%)" }}>
                  Joined Groups
                </Button>
              </NextLink>
            </Stack>

            <CreateGroup>
              <Button
                w="full"
                leftIcon={<FiPlus />}
                size="lg"
                fontSize="md"
                rounded="full"
                bgColor="black"
                color="#fff"
                _hover={{ bgColor: "blackAlpha.800" }}
                _active={{ bgColor: "blackAlpha.700" }}
              >
                New Group
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

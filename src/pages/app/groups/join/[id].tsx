import React from "react";
import { Button, Center, chakra, Container, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react";

const Page = () => {
  return (
    <chakra.div bgImage="url('/bg-1.png')" bgRepeat="no-repeat" bgSize="100% 50vh" minH="100vh">
      <Container maxW="container.lg" py={{ base: 10, md: 32 }} px={{ base: 4, md: 4 }}>
        <Stack
          spacing={{ base: 6 }}
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "stretch" }}
        >
          <Stack w={{ md: "sm" }} spacing={8}>
            <Image w="150px" src="/logo-full.svg" alt="Logo" />

            <Heading as="h1" color="white" fontWeight="600">
              The platform for group subscriptions.
            </Heading>
          </Stack>

          <Stack
            px={4}
            py={4}
            shadow="lg"
            spacing={8}
            rounded="4px"
            w={{ md: "sm" }}
            backdropBlur="12px"
            bgColor="rgba(255, 255, 255, 0.9)"
          >
            <Stack spacing={1}>
              <Text opacity="0.46" fontSize="sm">
                You’re invited to join
              </Text>
              <Heading as="h2" fontSize="lg">
                Family Subscriptions
              </Heading>
            </Stack>

            <Stack spacing={0}>
              <Text opacity={0.48} fontSize={{ base: "xs", md: "10px" }} fontWeight="600" textTransform="uppercase">
                Group Admin
              </Text>

              <Text fontWeight="600">Marvin Kome</Text>
            </Stack>

            <Stack spacing={4}>
              <Text opacity={0.48} fontSize={{ base: "xs", md: "10px" }} fontWeight="600" textTransform="uppercase">
                Active Subscriptions
              </Text>

              <SimpleGrid columns={4} spacing={4}>
                <Center textAlign="center" bgColor="#fff" rounded="4px" px={4} py={2}>
                  <Image src="/disney+.svg" alt="Netflix" w="full" maxH="40px" />
                </Center>

                <Center textAlign="center" bgColor="#fff" rounded="4px" px={4} py={2}>
                  <Image src="/netflix.svg" alt="Netflix" w="full" maxH="40px" />
                </Center>

                <Center textAlign="center" bgColor="#fff" rounded="4px" px={4} py={2}>
                  <Image src="/disney+.svg" alt="Netflix" w="full" maxH="40px" />
                </Center>

                <Center textAlign="center" bgColor="#fff" rounded="4px" px={4} py={2}>
                  <Image src="/netflix.svg" alt="Netflix" w="full" maxH="40px" />
                </Center>
              </SimpleGrid>
            </Stack>

            <Button colorScheme="secondary">Join Group</Button>
          </Stack>
        </Stack>
      </Container>
    </chakra.div>
  );
};

export default Page;

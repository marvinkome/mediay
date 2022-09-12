import React from "react";
import { Container, Heading, LinkBox, LinkOverlay, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import AppLayout from "components/app.layout";
import NextLink from "next/link";

const Page = () => {
  return (
    <Container maxW="container.xl" py={6}>
      <Stack mb={6}>
        <Heading fontSize="xl" fontWeight="600">
          All Groups
        </Heading>
      </Stack>

      <SimpleGrid columns={3} spacing={4}>
        {Array.from({ length: 4 }).map((_, idx) => {
          return (
            <LinkBox
              key={idx}
              as={Stack}
              bgColor="#fff"
              rounded="1.5em"
              border="1px solid rgb(0 0 0 / 10%)"
              alignItems="flex-start"
              px={5}
              py={4}
              spacing={4}
              overflow="hidden"
              minW="0"
              role="group"
              _hover={{ textDecoration: "none", borderColor: "rgb(0 0 0 / 18%)" }}
            >
              <Heading
                fontSize="md"
                fontWeight="700"
                borderBottom="1px solid rgb(0 0 0 / 70%)"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                w="auto"
                maxW="calc(100%)"
                overflow="hidden"
              >
                <NextLink href="/app/group/1234" passHref>
                  <LinkOverlay>RLM</LinkOverlay>
                </NextLink>
              </Heading>

              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} w="full">
                <Text fontWeight="600" fontSize="sm">
                  2 Members
                </Text>
              </Stack>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

Page.Layout = AppLayout;
export default Page;

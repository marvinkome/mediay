import React from "react";
import { Avatar, AvatarGroup, Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import AppLayout from "components/app.layout";

const GroupCard = (props: any) => {
  return (
    <Stack
      bgColor="#fff"
      rounded="1.5em"
      border="1px solid rgb(0 0 0 / 10%)"
      alignItems="flex-start"
      px={5}
      py={4}
      spacing={4}
      overflow="hidden"
      minW="0"
    >
      <Heading
        as="a"
        fontSize="md"
        fontWeight="700"
        borderBottom="1px solid rgb(0 0 0 / 70%)"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        w="auto"
        maxW="calc(100%)"
        overflow="hidden"
      >
        {props.name}
      </Heading>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} w="full">
        <Text fontSize="md">2 Members</Text>

        <AvatarGroup size="sm" max={2}>
          <Avatar name="Netflix" src="/netflix.svg" sx={{ "& > img": { objectFit: "contain" } }} />
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" sx={{ "& > img": { objectFit: "contain" } }} />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" sx={{ "& > img": { objectFit: "contain" } }} />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" sx={{ "& > img": { objectFit: "contain" } }} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
};

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
            <Stack
              key={idx}
              bgColor="#fff"
              rounded="1.5em"
              border="1px solid rgb(0 0 0 / 10%)"
              alignItems="flex-start"
              px={5}
              py={4}
              spacing={4}
              overflow="hidden"
              minW="0"
            >
              <Heading
                as="a"
                fontSize="md"
                fontWeight="700"
                borderBottom="1px solid rgb(0 0 0 / 70%)"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                w="auto"
                maxW="calc(100%)"
                overflow="hidden"
              >
                RLM
              </Heading>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} w="full">
                <Text fontWeight="600" fontSize="sm">
                  2 Members
                </Text>
              </Stack>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

Page.Layout = AppLayout;
export default Page;

import React from "react";
import Head from "next/head";
import {
  Link,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  Box,
  HStack,
  Grid,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import AppLayout from "components/app.layout";

const Page = () => {
  return (
    <Container maxW="container.xl" py={6}>
      <Stack mb={6}>
        <Heading fontSize="xl" fontWeight="600">
          My Account
        </Heading>
      </Stack>

      <Stack spacing={6} mb={6}>
        <Stack spacing={2}>
          <Heading fontWeight="400" fontSize="xs" textTransform="uppercase">
            Full Name
          </Heading>

          <Text fontWeight="600">Marvin Kome</Text>
        </Stack>

        <Stack spacing={2}>
          <Heading fontWeight="400" fontSize="xs" textTransform="uppercase">
            Email Address
          </Heading>

          <Text fontWeight="600">marvinkome@gmail.com</Text>
        </Stack>

        <Stack spacing={2}>
          <Heading fontWeight="400" fontSize="xs" textTransform="uppercase">
            Phone Number
          </Heading>

          <Text fontWeight="600">0123456789</Text>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            px={6}
            colorScheme="primary"
            rounded="24px"
            variant="ghost"
            bgColor="primary.50"
            fontSize="sm"
            border="1px solid transparent"
            _hover={{ borderColor: "primary.600" }}
          >
            Edit Account
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

Page.Layout = AppLayout;
export default Page;

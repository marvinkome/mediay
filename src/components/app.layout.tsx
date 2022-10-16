import React from "react";
import NextLink from "next/link";
import { Avatar, chakra, Image, Icon, Stack, Container, Button, Link } from "@chakra-ui/react";
import { FiChevronLeft, FiMoreHorizontal } from "react-icons/fi";
import { AuthContext } from "hooks/auth";

import Account from "components/account";

type AppLayoutProps = {
  children: React.ReactElement;
  backButton?: { href: string; title: string };
  user: { id: string; fullName: string | null; email: string };
};
const Layout = ({ children, ...props }: AppLayoutProps) => {
  return (
    <AuthContext.Provider value={props.user}>
      <chakra.div bgImage="url('/bg-1.png')" bgRepeat="no-repeat" bgSize="100% 50vh" minH="100vh">
        <chakra.header>
          <Stack py={{ base: 2, md: 5 }} px={{ base: 2, md: 10 }} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={4} display={{ base: "none", md: "flex" }}>
              <Image src="/logo.svg" alt="logo" boxSize={10} />
            </Stack>

            {props.backButton ? (
              <NextLink href={props.backButton.href} passHref>
                <Button
                  size="sm"
                  as={Link}
                  color="#fff"
                  rounded="50px"
                  colorScheme="whiteAlpha"
                  bgColor="rgba(255, 255, 255, 0.16)"
                  leftIcon={<Icon as={FiChevronLeft} />}
                  display={{ base: "inline-flex", md: "none" }}
                  _hover={{ bgColor: "rgba(255, 255, 255, 0.36)" }}
                  _active={{ bgColor: "rgba(255, 255, 255, 0.36)" }}
                >
                  {props.backButton.title}
                </Button>
              </NextLink>
            ) : (
              <Stack direction="row" alignItems="center" spacing={4} display={{ base: "flex", md: "none" }}>
                <Image src="/logo.svg" alt="logo" boxSize={10} />
              </Stack>
            )}

            <Account
              user={props.user}
              variant="ghost"
              colorScheme="whiteAlpha"
              aria-label="open account settings"
              rounded="full"
              leftIcon={<Avatar name={props.user.fullName || ""} size="sm" />}
              rightIcon={<Icon boxSize={6} color="white" as={FiMoreHorizontal} />}
            />
          </Stack>
        </chakra.header>

        <Container maxW="container.xl" py={{ base: 10, md: 4 }} px={{ base: 0, md: 4 }}>
          {children}
        </Container>
      </chakra.div>
    </AuthContext.Provider>
  );
};

export default Layout;

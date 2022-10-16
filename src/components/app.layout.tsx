import React from "react";
import { Avatar, chakra, Image, Icon, Stack, Container } from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import Account from "components/account";
import { AuthContext } from "hooks/auth";

type AppLayoutProps = {
  children: React.ReactElement;
  user: { id: string; fullName: string | null; email: string };
};
const Layout = ({ children, ...props }: AppLayoutProps) => {
  return (
    <AuthContext.Provider value={props.user}>
      <chakra.div bgImage="url('/bg-1.png')" bgRepeat="no-repeat" bgSize="100% 50vh" minH="100vh">
        <chakra.header>
          <Stack py={{ base: 2, md: 5 }} px={{ base: 2, md: 10 }} direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={4}>
              <Image src="/logo.svg" alt="logo" boxSize={10} />
            </Stack>

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

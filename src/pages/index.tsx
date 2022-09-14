import { Button, Container, Heading, Text } from "@chakra-ui/react";
import SignupModal from "components/auth";

const Page = () => {
  return (
    <Container py={10}>
      <Heading>Future landing page</Heading>
      <Text>Use this button to create an account</Text>

      <SignupModal>
        <Button my={6}>Get started</Button>
      </SignupModal>
    </Container>
  );
};

export default Page;

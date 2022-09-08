import React from "react";
import { chakra, Container, Heading, Stack, Button, Text, Grid } from "@chakra-ui/react";
import { SiSpotify, SiNetflix, SiAmazon } from "react-icons/si";
import { BiMovie } from "react-icons/bi";

const Page = () => {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const onToggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s.toLowerCase() !== service.toLowerCase()));
    } else {
      setSelectedServices(selectedServices.concat(service));
    }
  };

  return (
    <chakra.div bgColor="gray.100" minH="100vh" py={40}>
      <Container maxW="lg" bgColor="#fff" rounded="xl" shadow="base" py={4} px={6}>
        <Heading fontSize="2xl">Create a group</Heading>

        <Stack mt={5} spacing={4}>
          <Text>First, you&apos;ll need to select the subscriptions you would like to share with your friends</Text>

          <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={4}>
            <Button
              h={14}
              leftIcon={<SiSpotify />}
              isActive={selectedServices.includes("spotify")}
              onClick={() => onToggleService("spotify")}
              _active={{ bgColor: "blackAlpha.800", color: "whiteAlpha.900" }}
            >
              Spotify
            </Button>
            <Button
              h={14}
              leftIcon={<BiMovie />}
              isActive={selectedServices.includes("disney+")}
              onClick={() => onToggleService("disney+")}
              _active={{ bgColor: "blackAlpha.800", color: "whiteAlpha.900" }}
            >
              Disney+
            </Button>
            <Button
              h={14}
              leftIcon={<SiAmazon />}
              isActive={selectedServices.includes("prime-tv")}
              onClick={() => onToggleService("prime-tv")}
              _active={{ bgColor: "blackAlpha.800", color: "whiteAlpha.900" }}
            >
              Prime TV
            </Button>
            <Button
              h={14}
              leftIcon={<SiNetflix />}
              isActive={selectedServices.includes("netflix")}
              onClick={() => onToggleService("netflix")}
              _active={{ bgColor: "blackAlpha.800", color: "whiteAlpha.900" }}
            >
              Netflix
            </Button>
          </Grid>

          <Button>Add service</Button>
        </Stack>
      </Container>
    </chakra.div>
  );
};

export default Page;

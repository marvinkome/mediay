import React from "react";
import {
  Button,
  chakra,
  Heading,
  Image,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import ServiceModal from "./service";
import AddService from "./add-service";

const List = () => {
  return (
    <Stack spacing={4} px={6} py={4}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <LinkBox
          as={Stack}
          key={idx}
          direction="row"
          alignItems="flex-start"
          border="1px solid rgba(58, 27, 234, 0.06)"
          rounded="4px"
          px={4}
          py={4}
        >
          <Image boxSize={10} src="/netflix.svg" alt="netflix" />
          <Stack spacing={1} justifyContent="space-between">
            <Heading as="h2" fontWeight="600" fontSize="md">
              <ServiceModal>
                <LinkOverlay>Netflix</LinkOverlay>
              </ServiceModal>
            </Heading>

            <Text fontSize="sm" opacity={0.6}>
              Added by Marvin
            </Text>
          </Stack>

          <Stack ml="auto !important" direction="row" alignItems="center" spacing={4}>
            <Text textTransform="uppercase" color="#04CD31" fontSize="xs" fontWeight="600">
              Active
            </Text>

            <Text textTransform="uppercase" fontSize="xs" fontWeight="600">
              1 Spot left
            </Text>

            <chakra.div pl={2}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="open group option menu"
                  icon={<Icon as={FiMoreVertical} boxSize={5} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  color="gray.700"
                />

                <MenuList py={0} rounded="4px" border="1px solid rgba(2, 2, 4, 0.08)" filter="drop-shadow(0px 8px 64px rgba(0, 0, 0, 0.1))">
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Copy Invite Link
                  </MenuItem>
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Edit Group
                  </MenuItem>
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Delete Group
                  </MenuItem>
                </MenuList>
              </Menu>
            </chakra.div>
          </Stack>
        </LinkBox>
      ))}
    </Stack>
  );
};

const Members = () => {
  return (
    <Stack px={6} py={4}>
      <chakra.div>
        <Stack py={2}>
          <Heading
            as="h4"
            py={2}
            fontSize="xs"
            opacity={0.48}
            fontWeight="600"
            textTransform="uppercase"
            borderBottom="1px solid rgba(58, 27, 234, 0.08)"
          >
            Group Admin
          </Heading>
        </Stack>

        <Stack spacing={2}>
          <Stack py={2} spacing={3} direction="row" alignItems="center">
            <chakra.div boxSize="40px" rounded="full" bgColor="#FC9C9C" />
            <Text flexGrow="1">Marvin Kome</Text>

            <chakra.div pl={2}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="open group option menu"
                  icon={<Icon as={FiMoreVertical} boxSize={5} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  color="gray.700"
                />

                <MenuList py={0} rounded="4px" border="1px solid rgba(2, 2, 4, 0.08)" filter="drop-shadow(0px 8px 64px rgba(0, 0, 0, 0.1))">
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Copy Invite Link
                  </MenuItem>
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Edit Group
                  </MenuItem>
                  <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                    Delete Group
                  </MenuItem>
                </MenuList>
              </Menu>
            </chakra.div>
          </Stack>
        </Stack>
      </chakra.div>

      <chakra.div>
        <Stack py={2}>
          <Heading
            as="h4"
            py={2}
            fontSize="xs"
            opacity={0.48}
            fontWeight="600"
            textTransform="uppercase"
            borderBottom="1px solid rgba(58, 27, 234, 0.08)"
          >
            3 Members
          </Heading>
        </Stack>

        <Stack spacing={2}>
          {Array.from({ length: 2 }).map((_, idx) => (
            <Stack key={idx} py={2} spacing={3} direction="row" alignItems="center">
              <chakra.div boxSize="40px" rounded="full" bgColor="#C69CFC" />
              <Text flexGrow="1">Lenny Johnson</Text>

              <chakra.div pl={2}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="open group option menu"
                    icon={<Icon as={FiMoreVertical} boxSize={5} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    color="gray.700"
                  />

                  <MenuList
                    py={0}
                    rounded="4px"
                    border="1px solid rgba(2, 2, 4, 0.08)"
                    filter="drop-shadow(0px 8px 64px rgba(0, 0, 0, 0.1))"
                  >
                    <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                      Copy Invite Link
                    </MenuItem>
                    <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                      Edit Group
                    </MenuItem>
                    <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                      Delete Group
                    </MenuItem>
                  </MenuList>
                </Menu>
              </chakra.div>
            </Stack>
          ))}
        </Stack>
      </chakra.div>
    </Stack>
  );
};

const GroupCard = () => {
  return (
    <chakra.div>
      <Tabs variant="soft-rounded">
        <Stack
          px={6}
          py={4}
          spacing={6}
          backdropFilter="auto"
          backdropBlur="12px"
          bgColor="rgba(255, 255, 255, 0.16)"
          rounded="4px 4px 0px 0px"
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Heading as="h1" fontSize="2xl" color="white">
              Family Subscriptions
            </Heading>

            <AddService>
              <Button
                variant="ghost"
                colorScheme="whiteAlpha"
                color="white"
                fontWeight="700"
                fontSize="xs"
                textTransform="uppercase"
                leftIcon={<Icon boxSize={5} as={IoIosAdd} />}
              >
                Add Subscription
              </Button>
            </AddService>
          </Stack>

          <TabList>
            <Stack direction="row">
              <Tab color="white" opacity="0.68" _selected={{ opacity: 1, bgColor: "rgba(255, 255, 255, 0.16)" }}>
                Services
              </Tab>

              <Tab color="white" opacity="0.68" _selected={{ opacity: 1, bgColor: "rgba(255, 255, 255, 0.16)" }}>
                Members
              </Tab>
            </Stack>
          </TabList>

          <chakra.div w="60%">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon color="white" as={RiSearchLine} />
              </InputLeftElement>

              <Input
                rounded="50px"
                color="white"
                borderColor="rgba(255, 255, 255, 0.24)"
                type="text"
                placeholder="Search Services"
                _placeholder={{ color: "rgba(255, 255, 255, 0.24)" }}
                _focus={{ borderColor: "rgba(255, 255, 255, 0.64)", outline: "none", boxShadow: "none" }}
              />
            </InputGroup>
          </chakra.div>
        </Stack>

        <chakra.main bgColor="white">
          <TabPanels>
            <TabPanel p={0}>
              <List />
            </TabPanel>

            <TabPanel p={0}>
              <Members />
            </TabPanel>
          </TabPanels>
        </chakra.main>
      </Tabs>
    </chakra.div>
  );
};

export default GroupCard;

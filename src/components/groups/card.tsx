import React from "react";
import Api from "libs/api";
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
  useToast,
} from "@chakra-ui/react";
import ConfirmButton from "components/confirm-button";
import { IoIosAdd } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AddService from "../add-service";
import ServiceModal from "./modals/service";

const Service = ({ service, user, groupId }: any) => {
  const toast = useToast();
  const addedBy = service.users.find((u: any) => u.isCreator)?.user;

  const queryClient = useQueryClient();
  const removeServiceMutation = useMutation(
    async (data: any) => {
      return Api().post("/service/remove", data);
    },
    {
      onSuccess: async ({ payload }) => {
        queryClient.setQueryData(["group", groupId], (group: any) => {
          return { ...group, services: group.services.filter((s: any) => s.id !== payload.service.id) };
        });
      },
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error removing service",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return (
    <LinkBox
      px={4}
      py={4}
      as={Stack}
      rounded="4px"
      direction="row"
      cursor="pointer"
      alignItems="center"
      border="1px solid rgba(58, 27, 234, 0.06)"
      _hover={{ borderColor: "rgba(58, 27, 234, 0.12)" }}
    >
      <Image boxSize={10} src="/netflix.svg" alt="netflix" />
      <Stack spacing={1} justifyContent="space-between">
        <Heading as="h2" fontWeight="600" fontSize="md" textTransform="capitalize">
          <ServiceModal groupId={groupId} service={service} user={user}>
            <LinkOverlay>{service.name}</LinkOverlay>
          </ServiceModal>
        </Heading>

        {!!addedBy && (
          <Text fontSize="sm" opacity={0.6}>
            Added by {addedBy.fullName}
          </Text>
        )}
      </Stack>

      <Stack role="group" ml="auto !important" direction="row" alignItems="center" spacing={4}>
        <Text textTransform="uppercase" fontSize="xs" fontWeight="600">
          {service.numberOfPeople - service.users.length} Spot left
        </Text>

        <chakra.div>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="open service option menu"
              icon={<Icon as={FiMoreVertical} boxSize={5} />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              color="gray.700"
            />

            <MenuList py={0} rounded="4px" border="1px solid rgba(2, 2, 4, 0.08)" filter="drop-shadow(0px 8px 64px rgba(0, 0, 0, 0.1))">
              <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                Delete Service
              </MenuItem>
            </MenuList>
          </Menu>
        </chakra.div>

        {/* <ConfirmButton
          actionButton={{
            size: "sm",
            color: "red.500",
            colorScheme: "red",
            variant: "ghost",
            children: "Remove Service",
            isLoading: removeServiceMutation.isLoading,
            rightIcon: <Icon as={BsTrash} boxSize={4} />,
          }}
          confirmButton={{
            px: 4,
            fontSize: "sm",
            variant: "outline",
            children: "Remove Service",
            colorScheme: "red",
            isLoading: removeServiceMutation.isLoading,
            onClick: () => removeServiceMutation.mutate({ id: service.id }),
          }}
        >
          <Stack spacing={2}>
            <Heading fontSize="lg">Remove service</Heading>

            <Text color="rgb(0 0 0 / 65%)">Are you sure you want to remove this service from this group?</Text>
          </Stack>
        </ConfirmButton> */}
      </Stack>
    </LinkBox>
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

const GroupCard = (props: any) => {
  const { data: group } = useQuery<any>({
    queryKey: ["group", props.group.id],
    queryFn: (async () => {}) as any,
    initialData: props.group,
  });

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
              {group.name}
            </Heading>

            <AddService groupId={group.id}>
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
              <Stack spacing={4} px={6} py={4}>
                {group.services.map((service: any, idx: any) => (
                  <Service service={service} user={props.user} groupId={props.group.id} key={idx} />
                ))}
              </Stack>
            </TabPanel>

            <TabPanel p={0}>
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
                    {group.members
                      .filter((m: any) => m.isAdmin)
                      .map((member: any) => (
                        <Stack key={member.user.id} py={2} spacing={3} direction="row" alignItems="center">
                          <chakra.div boxSize="40px" rounded="full" bgColor="#C69CFC" />
                          <Text flexGrow="1">{member.user.fullName}</Text>
                        </Stack>
                      ))}
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
                      {group.members.filter((m: any) => !m.isAdmin).length} Members
                    </Heading>
                  </Stack>

                  <Stack spacing={2}>
                    {group.members
                      .filter((m: any) => !m.isAdmin)
                      .map((member: any) => (
                        <Stack key={member.user.id} py={2} spacing={3} direction="row" alignItems="center">
                          <chakra.div boxSize="40px" rounded="full" bgColor="#C69CFC" />
                          <Text flexGrow="1">{member.user.fullName}</Text>
                        </Stack>
                      ))}
                  </Stack>
                </chakra.div>
              </Stack>
            </TabPanel>
          </TabPanels>
        </chakra.main>
      </Tabs>
    </chakra.div>
  );
};

export default GroupCard;

import React from "react";
import Api from "libs/api";
import prisma from "libs/prisma";
import NextLink from "next/link";
import Layout from "components/app.layout";
import { GetServerSideProps } from "next";
import { withSessionSsr } from "libs/session";
import {
  Center,
  chakra,
  Image,
  Heading,
  Stack,
  Text,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useBreakpointValue,
  useDisclosure,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { randomColor } from "@chakra-ui/theme-tools";
import { IoIosAdd } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "react-use";

import CreateGroup from "components/groups/create";
import EditGroup from "components/groups/modals/edit";
import { IoClose } from "react-icons/io5";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!appUrl) {
  throw new Error("APP_URL env variable not set");
}

const ListItem = ({ group, user }: { group: PageData["groups"][0]; user: PageData["user"] }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const isAdmin = !!group.members.find((m) => m.isAdmin && m.user.id === user.id);

  const { hasCopied, onCopy } = useClipboard(`${appUrl}/app/groups/${group.id}/join`);

  const confirmRemoveModal = useDisclosure();
  const modalMotionPreset = useBreakpointValue<any>({ base: "slideInBottom", md: "scale" });

  const deleteGroupMutation = useMutation(
    async () => {
      return Api().post(`/groups/remove`, { id: group.id });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["groups"]);
      },

      onError: (err: any) => {
        console.error(err);

        toast({
          title: "Error deleting group",
          description: err?.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  return (
    <Stack
      as={LinkBox}
      px={3}
      py={3}
      spacing={3}
      direction="row"
      alignItems="center"
      cursor="pointer"
      _hover={{
        bgColor: "rgba(47, 53, 66, 0.04)",
      }}
    >
      <chakra.div boxSize="30px" rounded="full" bgColor={randomColor({ string: group.name })} />

      <Text flexGrow="1">
        <NextLink href={`/app/groups/${group.id}`} passHref>
          <LinkOverlay>{group.name}</LinkOverlay>
        </NextLink>
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
            <MenuItem
              fontSize="sm"
              _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
              _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
              onClick={onCopy}
            >
              {hasCopied ? "Copied" : "Copy Invite Link"}
            </MenuItem>

            {isAdmin && (
              <EditGroup group={group}>
                <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                  Edit Group
                </MenuItem>
              </EditGroup>
            )}

            {isAdmin && (
              <MenuItem
                fontSize="sm"
                onClick={() => confirmRemoveModal.onOpen()}
                _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
                _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}
              >
                Delete Group
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </chakra.div>

      <Modal isOpen={confirmRemoveModal.isOpen} onClose={confirmRemoveModal.onClose} motionPreset={modalMotionPreset}>
        <ModalContent
          px={6}
          rounded="4px"
          overflow="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
        >
          <ModalHeader px={0} pt={4}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="600">
                Delete Group
              </Heading>

              <IconButton
                size="sm"
                variant="outline"
                rounded="full"
                onClick={() => confirmRemoveModal.onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0}>
            <Text color="rgb(0 0 0 / 60%)">
              Are you sure you want to remove this subscription? You will not be able to undo this action
            </Text>
          </ModalBody>

          <ModalFooter px={0}>
            <Button
              mr={3}
              variant="ghost"
              colorScheme="gray"
              fontSize="sm"
              onClick={confirmRemoveModal.onClose}
              isDisabled={deleteGroupMutation.isLoading}
            >
              Cancel
            </Button>

            <Button colorScheme="red" fontSize="sm" onClick={() => deleteGroupMutation.mutate()} isLoading={deleteGroupMutation.isLoading}>
              Delete Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export const List = ({ user, groups: initialGroups }: { user: PageData["user"]; groups: PageData["groups"] }) => {
  const [initialData, setInitialData] = React.useState<any>(initialGroups);
  const [rawSearch, setRawSearch] = React.useState<string>();
  const [search, setSearch] = React.useState<string>();

  useDebounce(() => setSearch(rawSearch), 2000, [rawSearch]);

  React.useEffect(() => {
    setInitialData(undefined);
  }, []);

  const { data: groups, isLoading } = useQuery<PageData["groups"]>({
    queryKey: ["groups", search],
    queryFn: async () => {
      const { payload } = await Api().get(`/groups?search=${search ?? ""}`);

      return payload.groups;
    },
    initialData,
  });

  return (
    <chakra.div h="100%" rounded={{ base: 0, md: "4px" }} bgColor="rgba(255, 255, 255)" border="1px solid rgba(58, 27, 234, 0.08)">
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={3} py={4}>
        <Heading as="h3" fontSize="sm" opacity={0.87} textTransform="uppercase" fontWeight={700}>
          Groups
        </Heading>

        <CreateGroup>
          <Button colorScheme="primary" rounded="4px" h="auto" leftIcon={<Icon as={IoIosAdd} boxSize="20px" />}>
            Create
          </Button>
        </CreateGroup>
      </Stack>

      <chakra.div>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={RiSearchLine} />
          </InputLeftElement>

          <Input
            rounded="0px"
            borderWidth="1px 0px"
            borderColor="rgba(58, 27, 234, 0.1)"
            type="text"
            placeholder="Search"
            value={rawSearch || ""}
            onChange={(e) => setRawSearch(e.target.value)}
            _placeholder={{ opacity: 0.36 }}
            _focus={{ borderColor: "rgba(58, 27, 234, 0.2)", outline: "none", boxShadow: "none" }}
          />

          <InputRightElement pointerEvents="none">
            {isLoading && <CircularProgress isIndeterminate size="20px" color="primary.200" />}
          </InputRightElement>
        </InputGroup>
      </chakra.div>

      <Stack py={4}>
        {!isLoading && (search || search?.length) && !groups?.length && (
          <Text textAlign="center" flexGrow="1">
            No group containing &quot;{search}&quot;
          </Text>
        )}

        {!search && !groups?.length && !isLoading && (
          <Stack alignItems="center" spacing={6} px={8}>
            <Text textAlign="center" fontSize="sm">
              You have not created any groups yet. Use this button to create your first group
            </Text>

            <chakra.div>
              <CreateGroup>
                <Button leftIcon={<FiPlus />} fontSize="sm" colorScheme="primary">
                  Create your first group
                </Button>
              </CreateGroup>
            </chakra.div>
          </Stack>
        )}

        {groups?.map((group) => (
          <ListItem key={group.id} group={group} user={user} />
        ))}
      </Stack>
    </chakra.div>
  );
};

const Page = ({ groups, user }: PageData) => {
  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div display={{ base: "none", md: "block" }} flex={2}>
        <Stack
          px={6}
          py={4}
          h="30%"
          spacing={6}
          alignItems="center"
          backdropBlur="12px"
          backdropFilter="auto"
          rounded="4px 4px 0px 0px"
          bgColor="rgba(255, 255, 255, 0.16)"
        />

        <Center h="70%" bgColor="#fff" flexDirection="column">
          <Image src="/empty-group.svg" alt="empty group" />

          <Heading mb={2} fontSize="2xl">
            Select a group
          </Heading>
          <Text>Access subscriptions by selecting or creating a group</Text>
        </Center>
      </chakra.div>

      <chakra.div flex={1}>
        <List groups={groups} user={user} />
      </chakra.div>
    </Stack>
  );
};

interface PageData {
  user: {
    id: string;
    fullName: string | null;
    email: string;
  };
  groups: {
    id: string;
    name: string;
    members: {
      isAdmin: boolean;
      user: {
        id: string;
      };
    }[];
  }[];
}
const getServerSidePropsFn: GetServerSideProps<PageData> = async ({ req, params }) => {
  if (!req.session.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const paramArr = params?.id as string[] | undefined;
  if (paramArr && paramArr.length > 1) {
    return { notFound: true };
  }
  const id = paramArr?.[0] || null;

  const user = await prisma.user.findUnique({
    where: { id: req.session.data.userId },
    select: { id: true, fullName: true, email: true },
  });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const groups = await prisma.group.findMany({
    take: 10,
    where: {
      members: {
        some: {
          userId: req.session.data.userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      members: {
        where: { isAdmin: true },
        select: { isAdmin: true, user: { select: { id: true } } },
      },
    },
  });

  return {
    props: {
      id,
      groups,
      user,
      layoutProps: {
        user,
      },
    },
  };
};
export const getServerSideProps = withSessionSsr(getServerSidePropsFn);

Page.Layout = Layout;
export default Page;

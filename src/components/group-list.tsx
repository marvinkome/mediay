import React from "react";
import Api from "libs/api";
import NextLink from "next/link";
import {
  useToast,
  useClipboard,
  Stack,
  LinkBox,
  chakra,
  LinkOverlay,
  Menu,
  MenuButton,
  IconButton,
  Icon,
  Heading,
  MenuList,
  MenuItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { randomColor } from "@chakra-ui/theme-tools";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { PageData } from "pages/app/groups";
import CreateGroup from "components/create-group";
import EditGroup from "components/edit-group";
import ConfirmButton from "components/confirm-button";

import { useUser } from "hooks/auth";

const appUrl = process.env.NEXT_PUBLIC_URL;
if (!appUrl) {
  throw new Error("NEXT_PUBLIC_URL env variable not set");
}

const ListItem = ({ group }: { group: PageData["groups"][0] }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const user = useUser();

  const { hasCopied, onCopy } = useClipboard(`${appUrl}/app/groups/${group.id}/join`);

  const isAdmin = !!group.members.find((m) => m.isAdmin && m.user.id === user?.id);

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
              <ConfirmButton
                title="Delete Group"
                Content={
                  <Text color="rgb(0 0 0 / 65%)">
                    Are you sure you want to remove this group? You will not be able to undo this action.
                  </Text>
                }
                ConfirmButton={
                  <Button
                    px={4}
                    colorScheme="red"
                    fontSize="sm"
                    isLoading={deleteGroupMutation.isLoading}
                    onClick={() => deleteGroupMutation.mutate()}
                  >
                    Delete Group
                  </Button>
                }
              >
                <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                  Delete Group
                </MenuItem>
              </ConfirmButton>
            )}
          </MenuList>
        </Menu>
      </chakra.div>
    </Stack>
  );
};

const List = ({ groups }: { groups: PageData["groups"] }) => {
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

      <Stack my={2} py={2} borderTop="1px solid" borderTopColor="rgba(58, 27, 234, 0.1)">
        {!!groups.length ? (
          groups.map((group) => <ListItem key={group.id} group={group} />)
        ) : (
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
      </Stack>
    </chakra.div>
  );
};

export default List;

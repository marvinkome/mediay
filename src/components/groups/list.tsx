import React from "react";
import Api from "libs/api";
import {
  Button,
  chakra,
  CircularProgress,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { randomColor } from "@chakra-ui/theme-tools";
import { IoIosAdd } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "react-use";
import CreateGroup from "./create";
import EditGroup from "./edit";

type ListProps = {
  groups: {
    id: string;
    name: string;
  }[];
};
const GroupList = ({ groups: initialGroups }: ListProps) => {
  const [initialData, setInitialData] = React.useState<any>(initialGroups);
  const [rawSearch, setRawSearch] = React.useState<string>();
  const [search, setSearch] = React.useState<string>();

  useDebounce(() => setSearch(rawSearch), 2000, [rawSearch]);

  React.useEffect(() => {
    setInitialData(undefined);
  }, []);

  const { data: groups, isLoading } = useQuery<ListProps["groups"]>({
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

        {groups?.map((group, idx) => (
          <Stack
            key={idx}
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
            <Text flexGrow="1">{group.name}</Text>

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

                  <EditGroup group={group}>
                    <MenuItem fontSize="sm" _hover={{ bgColor: "rgba(47, 53, 66, 0.04)" }} _focus={{ bgColor: "rgba(47, 53, 66, 0.04)" }}>
                      Edit Group
                    </MenuItem>
                  </EditGroup>

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
  );
};

export default GroupList;

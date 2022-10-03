import React from "react";
import {
  Button,
  chakra,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { FiMoreVertical } from "react-icons/fi";
import CreateGroup from "./create";

const GroupList = () => {
  return (
    <chakra.div h="100%" rounded={{ base: 0, md: 1 }} bgColor="rgba(255, 255, 255)" border="1px solid rgba(58, 27, 234, 0.08)">
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={3} py={4}>
        <Heading as="h3" fontSize="sm" opacity={0.87} textTransform="uppercase" fontWeight={700}>
          Groups
        </Heading>

        <CreateGroup>
          <Button colorScheme="primary" rounded="4px" leftIcon={<Icon as={IoIosAdd} boxSize="20px" />}>
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
            fontSize="sm"
            placeholder="Search"
            _placeholder={{ opacity: 0.36 }}
            _focus={{ borderColor: "rgba(58, 27, 234, 0.3)", outline: "none", boxShadow: "none" }}
          />
        </InputGroup>
      </chakra.div>

      <Stack py={4}>
        {Array.from({ length: 2 }).map((_, idx) => (
          <Stack
            key={idx}
            px={3}
            py={4}
            spacing={3}
            direction="row"
            alignItems="center"
            cursor="pointer"
            _hover={{
              bgColor: "rgba(47, 53, 66, 0.04)",
            }}
          >
            <chakra.div boxSize="30px" rounded="full" bgColor="#FC9C9C" />
            <Text flexGrow="1">Family subscription</Text>

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
        ))}
      </Stack>
    </chakra.div>
  );
};

export default GroupList;

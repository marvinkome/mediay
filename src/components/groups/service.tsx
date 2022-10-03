import React from "react";
import {
  Button,
  chakra,
  Heading,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { FiEdit, FiMoreVertical } from "react-icons/fi";

const text = `Here’s the login credidentials:

Username: marvinkome
Password: xyCvt567@%

To continue using the subscription you’ll need to pay a part of the next billing:

it’s $4 / by all 4 of us so $1 each

Pay to my account: 
Name: Marvin Kome
Account #: 110234567
Bank: Top bank`;

type ServiceProps = {
  children: React.ReactElement;
};
const Service = ({ children }: ServiceProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}>
        <ModalOverlay />
        <ModalContent
          px={6}
          rounded="0px"
          overflow="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
        >
          <ModalHeader px={0} pt={4}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="600">
                Subscription
              </Heading>

              <IconButton
                size="sm"
                variant="outline"
                rounded="full"
                onClick={() => onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0} pt={4} pb={4}>
            <Stack direction="row" alignItems="flex-start" rounded="4px" mb={5}>
              <Image boxSize={10} src="/netflix.svg" alt="netflix" />
              <Stack spacing={1} justifyContent="space-between">
                <Heading as="h2" fontWeight="600" fontSize="md">
                  Netflix
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
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Text fontSize="lg">Instructions</Text>

              <IconButton size="sm" variant="ghost" colorScheme="primary" rounded="full" aria-label="edit instructions" icon={<FiEdit />} />
            </Stack>

            <Stack>
              <Textarea px={0} minH="sm" opacity={0.72} border="0px" defaultValue={text} readOnly />

              <chakra.div pt={4} textAlign="right">
                <Button colorScheme="primary">Update Instructions</Button>
              </chakra.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Service;

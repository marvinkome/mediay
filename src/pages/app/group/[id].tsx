import React from "react";
import AppLayout from "components/app.layout";
import {
  Button,
  chakra,
  Container,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiEye, FiLink2, FiEdit3 } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";

const CredentialModal = ({ children }: any) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />

        <ModalContent my={8} rounded="20px">
          <ModalHeader pb={2}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton
                aria-label="close-modal"
                size="xs"
                icon={<Icon boxSize="16px" as={IoMdCloseCircle} />}
                p={0}
                rounded="full"
                bgColor="primary.50"
                _hover={{ bgColor: "primary.100" }}
                onClick={() => onClose()}
              />

              <Text fontSize="sm" color="rgb(0 0 0 / 75%)">
                Instructions
              </Text>
            </Stack>
          </ModalHeader>

          <ModalBody px={6} py={0} pb={4}>
            <Stack spacing={3}>
              <Text fontSize="sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, architecto! Ullam placeat itaque inventore ducimus.
                Accusamus vitae quis corrupti accusantium eligendi eum, nesciunt nihil, tempora maxime mollitia distinctio laborum qui.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam sed nam reprehenderit repudiandae corporis laborum numquam
                error, ipsum quas laboriosam et facilis nihil, quis corrupti dicta temporibus veritatis sit perspiciatis.
              </Text>

              <chakra.div>
                <Button
                  colorScheme="primary"
                  rounded="24px"
                  variant="ghost"
                  leftIcon={<Icon as={IoCopyOutline} />}
                  bgColor="primary.50"
                  fontSize="sm"
                  size="sm"
                  border="1px solid transparent"
                  _hover={{ borderColor: "primary.600" }}
                >
                  Copy Instructions
                </Button>
              </chakra.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const Page = () => {
  return (
    <Container maxW="container.lg" py={6}>
      <Stack direction="row" justifyContent="space-between">
        <chakra.div>
          <Heading fontSize="2xl" fontWeight="600" mb={1}>
            RLM
          </Heading>

          <Stack direction="row" alignItems="center" fontSize="sm">
            <Text color="rgb(0 0 0 / 48%)">Created on 11 Jul. 2022</Text>
            <chakra.span color="rgb(0 0 0 / 48%)">•</chakra.span>
            <Button minW="0" px={0} variant="link" fontSize="sm" _hover={{ textDecoration: "none", color: "rgb(0 0 0 / 68%)" }}>
              Edit group
            </Button>
          </Stack>
        </chakra.div>

        <chakra.div>
          <Text mb={1} fontWeight="700">
            Members
          </Text>

          <Text color="rgb(0 0 0 / 58%)">Marvin, Sophia, Alaric, Jane</Text>
        </chakra.div>
      </Stack>

      <chakra.section py={6}>
        <Stack py={4} direction="row" justifyContent="space-between" borderBottom="1px dashed rgb(0 0 0 / 15%)">
          <Text>Subscriptions</Text>
        </Stack>

        <Stack spacing={6} py={4}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Text>Spotify</Text>
              <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                1/3 spaces left
              </Text>
            </Stack>

            <CredentialModal>
              <Button
                size="sm"
                aria-label="View password"
                rounded="full"
                variant="outline"
                leftIcon={<FiEye />}
                _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
              >
                View instructions
              </Button>
            </CredentialModal>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Text>Netflix</Text>
              <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                3/3 spaces left
              </Text>
            </Stack>

            <CredentialModal>
              <Button
                size="sm"
                aria-label="View password"
                rounded="full"
                variant="outline"
                leftIcon={<FiEye />}
                _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
              >
                View instructions
              </Button>
            </CredentialModal>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Text>Disney+</Text>
              <Text fontSize="sm" color="rgb(0 0 0 / 70%)">
                0/3 spaces left
              </Text>
            </Stack>

            <CredentialModal>
              <Button
                size="sm"
                aria-label="View password"
                rounded="full"
                variant="outline"
                leftIcon={<FiEye />}
                _hover={{ bgColor: "primary.50", borderColor: "primary.100" }}
              >
                View instructions
              </Button>
            </CredentialModal>
          </Stack>
        </Stack>

        <Stack py={4} spacing={4} borderTop="1px dashed rgb(0 0 0 / 15%)">
          <Text>Note</Text>

          <Text width="75%" fontSize="sm" fontWeight="400" color="rgb(0 0 0 / 75%)">
            Hi Meg, here&apos;s the invoice for the complete payment of the website and brand design. The added $100 covers any additional
            cost for reviews and value tax. You can go ahead and wire the transfer and let me know if there are any issues. Thank you.
          </Text>

          <chakra.div>
            <Button
              colorScheme="primary"
              rounded="24px"
              variant="ghost"
              leftIcon={<Icon as={FiLink2} />}
              bgColor="primary.50"
              fontSize="sm"
              border="1px solid transparent"
              _hover={{ borderColor: "primary.600" }}
            >
              Copy Group link
            </Button>
          </chakra.div>
        </Stack>
      </chakra.section>
    </Container>
  );
};

Page.Layout = AppLayout;
export default Page;

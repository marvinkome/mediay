import React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Heading,
  HeadingProps,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

type ConfirmButtonProps = {
  title: string;
  titleProps?: HeadingProps;
  children: React.ReactElement;
  Content: React.ReactElement;
  ConfirmButton: React.ReactElement;
  cancelButton?: ButtonProps;
};

const ConfirmButton = ({ children, ...props }: ConfirmButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => onOpen(),
      })}

      <Modal isOpen={isOpen} onClose={onClose} motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}>
        <ModalOverlay />
        <ModalContent
          px={6}
          rounded="4px"
          overflow="hidden"
          mb={{ base: "0", md: 8 }}
          pos={{ base: "fixed", md: "relative" }}
          bottom={{ base: "0px", md: "initial" }}
        >
          <ModalHeader px={0}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Heading fontSize="lg" fontWeight="600" {...props.titleProps}>
                {props.title}
              </Heading>

              <IconButton
                size="sm"
                variant="ghost"
                rounded="full"
                onClick={() => onClose()}
                aria-label="close-modal"
                _hover={{ bgColor: "primary.50" }}
                icon={<Icon boxSize="18px" as={IoClose} />}
              />
            </Stack>
          </ModalHeader>

          <ModalBody px={0}>{props.Content}</ModalBody>

          <ModalFooter px={0}>
            <Button mr={3} variant="ghost" colorScheme="gray" fontSize="sm" onClick={onClose} {...props.cancelButton}>
              Cancel
            </Button>

            {props.ConfirmButton}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmButton;

import React from "react";
import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

type ConfirmButtonProps = {
  children: React.ReactElement;
  actionButton: ButtonProps;
  confirmButton: ButtonProps;
  cancelButton?: ButtonProps;
};

const ConfirmButton = ({ children, ...props }: ConfirmButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button onClick={() => onOpen()} {...props.actionButton} />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent my={8} mx={10} rounded="4px" py={4}>
          <ModalCloseButton />
          <ModalBody py={0} my={0}>
            {children}
          </ModalBody>

          <ModalFooter py={0} mt={4}>
            <Button mr={3} variant="ghost" colorScheme="gray" fontSize="sm" onClick={onClose} {...props.cancelButton}>
              Cancel
            </Button>

            <Button colorScheme="primary" fontSize="sm" {...props.confirmButton} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmButton;

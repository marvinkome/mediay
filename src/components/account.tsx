import React from "react";
import Api from "libs/api";
import {
  Button,
  ButtonProps,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { routeReplace } from "libs/utils";

type AccountProps = ButtonProps & {
  children?: React.ReactNode;
  user: { id: string; fullName: string | null; email: string };
};
const Account = ({ children, user, ...props }: AccountProps) => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [formValue, setFormValue] = React.useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const editAccountMutation = useMutation(
    async (data: any) => {
      return Api().post(`/account`, data);
    },
    {
      onSuccess: async () => {
        await routeReplace(router.asPath);
      },
    }
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editAccountMutation.mutate({
      fullName: formValue.fullName,
      id: user.id,
    });
  };

  return (
    <chakra.div>
      <Button onClick={() => onOpen()} {...props}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset={useBreakpointValue({ base: "slideInBottom", md: "scale" })}>
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
                Profile
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

          <ModalBody px={0} pt={0} pb={4}>
            <Stack as="form" onSubmit={onSubmit} w="full" spacing={4}>
              <FormControl>
                <FormLabel mb={1} fontSize="xs" fontWeight="600" textTransform="uppercase" opacity={0.48}>
                  Name
                </FormLabel>

                <Input
                  rounded="4px"
                  type="text"
                  placeholder="John Doe"
                  value={formValue.fullName}
                  onChange={(e) => setFormValue({ ...formValue, fullName: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel mb={1} fontSize="xs" fontWeight="600" textTransform="uppercase" opacity={0.48}>
                  Email
                </FormLabel>

                <Input
                  isReadOnly
                  rounded="4px"
                  type="email"
                  placeholder="John Doe"
                  value={formValue.email}
                  onChange={(e) => setFormValue({ ...formValue, email: e.target.value })}
                />
              </FormControl>

              <chakra.div pt={6} textAlign="right">
                <Button type="submit" colorScheme="primary" fontSize="sm" isLoading={editAccountMutation.isLoading}>
                  Update profile
                </Button>
              </chakra.div>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </chakra.div>
  );
};

export default Account;

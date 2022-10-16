import React from "react";
import Api from "libs/api";
import { useToast, chakra, Stack, Heading, Button, Text } from "@chakra-ui/react";
import { randomColor } from "@chakra-ui/theme-tools";
import { useMutation } from "@tanstack/react-query";
import { routeReplace } from "libs/utils";
import { useRouter } from "next/router";
import { PageData } from "pages/app/groups/[id]";
import { useUser } from "hooks/auth";

type MembersProps = {
  members: PageData["members"];
  requests: PageData["requests"];
  group: PageData["group"];
};
const Members = ({ group, members, requests }: MembersProps) => {
  const router = useRouter();
  const toast = useToast();
  const user = useUser();

  const admin = members.find((m) => m.isAdmin);
  const isAdmin = admin?.user.id === user?.id;

  const groupMembers = members.filter((m) => !m.isAdmin);

  const acceptRequest = useMutation(
    async ({ userId }: { userId: string }) => {
      const { payload } = await Api().post(`/groups/${group.id}/requests/accept`, { userId });
      await routeReplace(router.asPath);

      return payload;
    },
    {
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error accepting request",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );
  const declineRequest = useMutation(
    async ({ userId }: { userId: string }) => {
      const { payload } = await Api().post(`/groups/${group.id}/requests/decline`, { userId });
      await routeReplace(router.asPath);

      return payload;
    },
    {
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error declining request",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

  const removeMember = useMutation(
    async ({ userId }: { userId: string }) => {
      const { payload } = await Api().post(`/groups/${group.id}/remove-member`, { userId });
      return payload;
    },
    {
      onSuccess: async () => await routeReplace(router.asPath),
      onError: (err: any) => {
        console.error(err);
        toast({
          title: "Error accepting request",
          description: err.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );

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
            <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: admin?.user.fullName || "" })} />
            <Text flexGrow="1">{admin?.user.fullName}</Text>
          </Stack>
        </Stack>
      </chakra.div>

      {!!groupMembers.length && (
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
              {groupMembers.length} Members
            </Heading>
          </Stack>

          <Stack spacing={2}>
            {groupMembers.map((member, idx) => (
              <Stack key={idx} py={2} spacing={3} direction="row" alignItems="center">
                <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: member.user.fullName || "" })} />
                <Text flexGrow="1">{member.user.fullName}</Text>

                {isAdmin && (
                  <Stack direction="row">
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      isLoading={removeMember.isLoading}
                      onClick={() => removeMember.mutate({ userId: member.user.id })}
                    >
                      Remove Member
                    </Button>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </chakra.div>
      )}

      {!!requests.length && isAdmin && (
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
              {requests.length} Requests
            </Heading>
          </Stack>

          <Stack spacing={2}>
            {requests.map((request, idx) => (
              <Stack key={idx} py={2} spacing={3} direction="row" alignItems="center">
                <chakra.div boxSize="28px" rounded="full" bgColor={randomColor({ string: request.user.fullName || "" })} />
                <Text flexGrow="1">{request.user.fullName}</Text>

                <Stack direction="row">
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    isDisabled={declineRequest.isLoading}
                    isLoading={acceptRequest.isLoading}
                    onClick={() => acceptRequest.mutate({ userId: request.user.id })}
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    isDisabled={acceptRequest.isLoading}
                    isLoading={declineRequest.isLoading}
                    onClick={() => declineRequest.mutate({ userId: request.user.id })}
                  >
                    Decline
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </chakra.div>
      )}
    </Stack>
  );
};

export default Members;

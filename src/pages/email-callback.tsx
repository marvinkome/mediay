import React from "react";
import Api from "libs/api";
import { useRouter } from "next/router";
import { toParams } from "libs/react-oauth2/helpers";
import { chakra, Center, CircularProgress, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
  const router = useRouter();
  const authMutation = useMutation(async (data) => {
    await Api().post("/auth", data);
    router.push("/app");
  });

  React.useEffect(() => {
    const queryParams = toParams(window.location.search.replace(/^\?/, ""));
    const params = toParams(window.location.hash.replace(/^#/, ""));
    authMutation.mutate({ ...params, ...queryParams });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Center h="100vh">
      {authMutation.isError && (
        <chakra.div>
          <Text>Error authenticating. Link is invalid or has expired.</Text>
        </chakra.div>
      )}

      {authMutation.isLoading && <CircularProgress size={10} color="primary.500" isIndeterminate />}
    </Center>
  );
};
export default Page;

import React from "react";
import Layout from "components/app.layout";
import { chakra, Hide, SimpleGrid, Stack } from "@chakra-ui/react";

import Card from "components/groups/card";
import List from "components/groups/list";

const Page = () => {
  return (
    <Stack direction="row" minH="80vh" spacing={{ base: 0, md: 10 }}>
      <chakra.div display={{ base: "none", md: "block" }} flex={2}>
        <Card />
      </chakra.div>

      <chakra.div flex={1}>
        <List />
      </chakra.div>
    </Stack>
  );
};

Page.Layout = Layout;
export default Page;

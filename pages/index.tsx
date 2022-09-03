import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const Page = () => {
  return (
    <div>
      <h1>Future landing page</h1>

      <NextLink href="/signup">
        <Link>Get started</Link>
      </NextLink>
    </div>
  );
};

export default Page;

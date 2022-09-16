import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Head from "next/head";
import theme from "theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 240 * 1000,
      retry: 1,
    },
  },
});

const LayoutDefault = ({ children }: any) => <>{children}</>;

function App({ Component, pageProps }: any) {
  const Layout = Component.Layout || LayoutDefault;
  const layoutProps = pageProps.layoutProps || {};

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Mediay</title>
      </Head>

      <QueryClientProvider client={queryClient}>
        <Layout {...layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;

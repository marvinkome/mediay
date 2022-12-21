import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import theme from "theme";
import "custom-fonts.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});

const LayoutDefault = ({ children }: any) => <>{children}</>;

function App({ Component, pageProps }: any) {
  const Layout = Component.Layout || LayoutDefault;
  const layoutProps = pageProps.layoutProps || {};

  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Mediay</title>
        </Head>

        <QueryClientProvider client={queryClient}>
          <Layout {...layoutProps}>
            <Component {...pageProps} />
          </Layout>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>

      <Analytics />
    </>
  );
}

export default App;

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <ChakraProvider resetCSS>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;

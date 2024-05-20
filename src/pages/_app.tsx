import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Header from "@/components/HeaderNew";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Provider } from "react-redux";
import store, { persistor} from "../redux/store";

import { PersistGate } from 'redux-persist/integration/react';
//import { CookiesProvider } from "react-cookie";

import { EdgeStoreProvider } from '../lib/edgeStore';




const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps:  { ...pageProps }  }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={inter.className}>
     
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
          <EdgeStoreProvider>
       

            <Header />
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={true} />
            
            </EdgeStoreProvider>


          </QueryClientProvider>
          </PersistGate>
        </Provider>
    
      </div>
    </ThemeProvider>
  );
}

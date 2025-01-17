import { AppProps } from "next/app"; // Import the AppProps type
import { SessionProvider } from "next-auth/react";
import "@/styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
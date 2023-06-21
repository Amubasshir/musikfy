// import { SessionProvider } from 'next-auth/react';

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }

import { Provider as NextAuthProvider } from 'next-auth/client';
import App from '../path/to/App';

export default function MyApp({ Component, pageProps }) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <App {...pageProps} />
    </NextAuthProvider>
  );
}

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import Navigation from '../components/common/Navigation';
import Head from 'next/head';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isAuthPage = router.pathname.includes('/auth') || router.pathname === '/';

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <ThemeProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          <div className="min-h-screen transition-colors duration-200 dark:bg-gray-900">
            {!isAuthPage && <Navigation />}
            
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            <div className={`${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}>
              <Component {...pageProps} />
            </div>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp; 
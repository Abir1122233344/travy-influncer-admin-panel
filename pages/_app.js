import '../styles/globals.css'
import Head from 'next/head'
import { useDarkMode } from '../lib/useDarkMode'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }) {
  const { isDarkMode } = useDarkMode()

  return (
    <ErrorBoundary>
      <Head>
        <title>Travy - Referral & Influencer Platform</title>
        <meta name="description" content="Professional referral and influencer management platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={isDarkMode ? 'dark' : ''}>
        <Component {...pageProps} />
      </div>
    </ErrorBoundary>
  )
}

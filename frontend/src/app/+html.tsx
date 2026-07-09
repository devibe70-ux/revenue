import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Standard SEO Tags */}
        <title>Unified Revenue Dashboard - Cross-Platform Financial Intelligence</title>
        <meta name="description" content="The ultimate cross-platform financial dashboard for tracking and analyzing your net revenue, Amazon Direct Sales, and YouTube Ad Revenue in one unified interface." />
        <meta name="keywords" content="Revenue Dashboard, Financial Intelligence, Amazon Sales Tracker, YouTube Ad Revenue, Finance App, Unified Revenue, Business Analytics" />
        <meta name="author" content="Unified Revenue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://revenudashboard.app" />

        {/* OpenGraph / Facebook (Social SEO) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Unified Revenue Dashboard - Cross-Platform Financial Intelligence" />
        <meta property="og:description" content="Track your complete financial footprint across Amazon, YouTube, and other platforms in a stunning, real-time dashboard." />
        <meta property="og:url" content="https://revenudashboard.app" />
        <meta property="og:site_name" content="Unified Revenue" />
        <meta property="og:image" content="https://revenudashboard.app/assets/og-image.jpg" />

        {/* Twitter Card (Social SEO) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unified Revenue Dashboard" />
        <meta name="twitter:description" content="The ultimate cross-platform financial dashboard. Track Amazon and YouTube revenue effortlessly." />
        <meta name="twitter:image" content="https://revenudashboard.app/assets/twitter-card.jpg" />

        {/* AEO (Answer Engine Optimization) & Rich Snippets via JSON-LD Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Unified Revenue Dashboard",
          "url": "https://revenudashboard.app",
          "description": "A cross-platform financial intelligence dashboard for tracking net revenue across Amazon, YouTube, and other storefronts.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web, Android, Windows",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "Unified Revenue"
          }
        })}} />

        {/* Google AdSense Integration */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7107715238624071" crossOrigin="anonymous"></script>

        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        
        {/* Google AdSense Privacy Settings Revocation Link (US CCPA/CPRA Compliance) */}
        <footer style={{ padding: '24px', textAlign: 'center', fontSize: '12px', backgroundColor: '#0B0D10', color: '#8A8F98', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <a href="javascript:googlefc.callbackQueue.push(googlefc.showRevocationMessage)" style={{ color: '#60A5FA', textDecoration: 'none' }}>Do Not Sell or Share My Personal Information</a>
        </footer>
      </body>
    </html>
  );
}

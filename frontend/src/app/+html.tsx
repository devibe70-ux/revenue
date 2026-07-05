import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Google AdSense Integration */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7107715238624071" crossOrigin="anonymous"></script>

        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        
        {/* Google AdSense Privacy Settings Revocation Link (US CCPA/CPRA Compliance) */}
        <footer style={{ padding: '20px', textAlign: 'center', fontSize: '12px', background: '#f5f5f5', color: '#666' }}>
          <a href="javascript:googlefc.callbackQueue.push(googlefc.showRevocationMessage)">Do Not Sell or Share My Personal Information</a>
        </footer>
      </body>
    </html>
  );
}

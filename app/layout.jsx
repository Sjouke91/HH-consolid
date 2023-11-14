import StoryblokProvider from '../components/StoryblokProvider';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import '../theme/main.scss';

storyblokInit({
  accessToken: 'tLYGPiLYLbBNhXpBCdPQcAtt',
  use: [apiPlugin],
  cache: {
    clear: 'auto',
    type: 'memory',
  },
  apiOptions: {
    region: 'eu',
    responseInterceptor: (response) => {
      if (process.env.CACHE_DEV_MODE === 'true') {
        console.log(
          'CV:',
          response.data.cv,
          '| SB API Layout | ',
          response.status,
          ' CACHE:',
          // MAYBE THIS HEADER IS NOT THE ONE WE SHOULD USE TO CHECK FOR CACHED RESPONSES
          response.headers['x-cache'],
        );
      }
      // ALWAYS return the response
      return response;
    },
  },
});

// app-router layout
export default async function RootLayout({ children, params }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {process.env.GTM_KEY && (
          <script
            id="gtm script"
            strategy="afterInteractive"
            data-type="gtm-script"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.GTM_KEY}');`,
            }}
          />
        )}
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GTM_KEY}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}

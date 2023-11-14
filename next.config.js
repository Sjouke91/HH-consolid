// const client = require('./contentful/client');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { createSecureHeaders } = require('next-secure-headers');

const user = {
  NODE_ENV: process.env.NODE_ENV,
  LANG_ATTRIBUTE: process.env.LANG,
  CLIENT_NAME: process.env.CLIENT_NAME,
  HOST_NAME: process.env.HOST_NAME,
  CUSTOMER: process.env.CUSTOMER,
  MONGO_API_KEY: process.env.MONGO_API_KEY,
  MONGO_APP_ID: process.env.MONGO_APP_ID,
  MIDDLEWARE_API_KEY: process.env.MIDDLEWARE_API_KEY,
  GTM_KEY:
    process.env.NODE_ENV === 'production'
      ? process.env.GTM_KEY
      : process.env.GTM_KEY_DEV,
  SEGMENT_KEY:
    process.env.NODE_ENV === 'production'
      ? process.env.SEGMENT_KEY
      : process.env.DEV_SEGMENT_KEY,
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  SLACK_CONVERSATION_ID: process.env.SLACK_CONVERSATION_ID,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  MONGO_URI: process.env.MONGODB_URI,
  MONGODB_VACANY_COLLECTION: process.env.MONGODB_VACANY_COLLECTION,
  MONGO_GRAPHQL_ENDPOINT: process.env.MONGO_GRAPHQL_ENDPOINT,
  MONGO_URI_CONNECTION: process.env.MONGO_URI_CONNECTION,
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
  CLIENT_NAME: process.env.CLIENT_NAME,
  GOOGLE_MAPS_API: process.env.GOOGLE_MAPS_API,
};

const nextConfig = {
  // i18n: {
  //   locales: ['de', 'nl'],
  //   defaultLocale: 'nl',
  // },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: false,
  reactStrictMode: false,
  env: {
    CUSTOMER: process.env.CUSTOMER,
  },

  webpack(config) {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...createSecureHeaders({
            frameGuard: false,
          }),
        ],
      },
    ];
  },

  async redirects() {
    const redirectArray = [
      { source: '/category/nieuws/', destination: '/', permanent: true },
      {
        source: '/payrolling/',
        destination: '/services/payrolling',
        permanent: true,
      },
      {
        source: '/total-workforce-management/',
        destination: '/professionals',
        permanent: true,
      },
      {
        source: '/werkenbij/',
        destination: '/over-fixedtoday/werkenbij/',
        permanent: true,
      },
      {
        source: '/privacybeleid/',
        destination: '/over-fixedtoday/privacybeleid',
        permanent: true,
      },
      {
        source: '/contracting-2/',
        destination: '/services/contracting',
        permanent: true,
      },
      { source: '/expats/', destination: '/services/expats', permanent: true },
      { source: '/seminar/', destination: '/', permanent: true },
      {
        source: '/over-ons-bedrijf/',
        destination: '/over-fixedtoday',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/software-developer-integrator/',
        destination: '/opdrachten/software-developer-integrator/',
        permanent: true,
      },
      { source: '/809-2-2/', destination: '/', permanent: true },
      {
        source: '/alle-aanvragen/ciso/',
        destination: '/opdrachten/ciso/',
        permanent: true,
      },
      { source: '/author/tloois/', destination: '/', permanent: true },
      {
        source: '/korting-op-opleidingen/',
        destination: '/nieuws/korting-op-opleidingen/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/technisch-applicatie-beheerder/',
        destination: '/opdrachten',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/senior-lead-matlab-simulink-engineer/',
        destination: '/opdrachten',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/devops-engineer-spoed/',
        destination: '/opdrachten',
        permanent: true,
      },
      {
        source: '/category/vacatures/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/informatieanalist-ihh/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/business-analist/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/full-stack-developer-devops-engineer/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/it-network-security-technology-expert/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/business-analist-2/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/solution-architect-analytics/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/software-developer-streamserve/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source:
          '/alle-aanvragen/system-engineer-medior-specialist-database-management-systemen/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/netwerk-engineer/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/adviseur-informatiebeheer/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/java-ontwikkelaars-5fte/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/software-integrator/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/senior-devops-engineer/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/security-specialist/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/programma-secretaris-cybersecurity-junior/',
        destination: '/opdrachten/',
        permanent: true,
      },
      {
        source: '/alle-aanvragen/functioneel-ontwerper/',
        destination: '/opdrachten/',
        permanent: true,
      },
      { source: '/\\?lang=en', destination: '/en', permanent: true },
      {
        source: '/contracting-2/\\?lang=en',
        destination: '/en/services/contracting',
        permanent: true,
      },
      {
        source: '/expats/\\?lang=en',
        destination: '/en/services/expats/',
        permanent: true,
      },
      {
        source: '/opdrachtgevers/\\?lang=en',
        destination: '/en/clients/',
        permanent: true,
      },
      {
        source: '/leveranciers/\\?lang=en',
        destination: '/en/suppliers',
        permanent: true,
      },
      {
        source: '/opdrachten/\\?lang=en',
        destination: '/en/projects/',
        permanent: true,
      },
      {
        source: '/privacybeleid/\\?lang=en',
        destination: '/en/about-fixedtoday/privacy-statement',
        permanent: true,
      },
      {
        source: '/werkenbij/\\?lang=en',
        destination: '/en/about-fixedtoday/carreer',
        permanent: true,
      },
      {
        source: '/over-ons-bedrijf/\\?lang=en',
        destination: '/en/about-fixedtoday',
        permanent: true,
      },
      {
        source: '/staffing/\\?lang=en',
        destination: '/en/services/staffing',
        permanent: true,
      },
      {
        source: '/professionals/\\?lang=en',
        destination: '/en/professionals',
        permanent: true,
      },
      {
        source: '/contact/\\?lang=en',
        destination: '/en/contact/',
        permanent: true,
      },
      {
        source: '/payrolling/\\?lang=en',
        destination: '/en/services/payrolling',
        permanent: true,
      },
      {
        source: '/category/uncategorized/\\?lang=en',
        destination: '/en',
        permanent: true,
      },
      { source: '/recruiter/\\?lang=en', destination: '/en', permanent: true },
    ];
    return redirectArray;
  },

  experimental: {
    serverComponentsExternalPackages: ['realm-web'],
  },
};

module.exports = nextConfig;

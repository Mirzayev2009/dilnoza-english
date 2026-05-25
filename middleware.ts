import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'uz', 'ru'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Do not add a locale prefix to the path (e.g. /uz/chatbot)
  localePrefix: 'never'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

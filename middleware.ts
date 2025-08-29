import { auth } from '@/auth';

export default auth;

export const config = {
  // The `matcher` config determines which paths the middleware will run on.
  // It's a regular expression that protects specific routes.
  // Here, we're protecting all paths under /client, /lawyer, and /admin.
  // This will automatically redirect unauthenticated users to the sign-in page.
  matcher: ['/client/:path*', '/lawyer/:path*', '/admin/:path*'],
};

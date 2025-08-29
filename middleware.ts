import { auth } from './auth';

export default auth;

export const config = {
  // This matcher ensures the middleware only runs on routes that need to be protected.
  matcher: ['/client/:path*', '/lawyer/:path*', '/admin/:path*'],
};

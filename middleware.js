// // middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // Check if the request is for /login or /register
//   const isAuthPage = pathname === '/login' || pathname === '/register';

//   // Get the token from cookies
//   const token = request.cookies.get('token')?.value;

//   // If user is authenticated (has a token) and trying to access /login or /register
//   if (isAuthPage && token) {
//     // Redirect to /dashboard
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // If no token and trying to access a protected route (optional, can expand this)
//   // For now, we only care about /login and /register, so let other requests pass
//   return NextResponse.next();
// }

// // Define which paths the middleware applies to
// export const config = {
//   matcher: ['/login', '/register','/'],
// };
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

import {validateAdminToken} from '@/utils/auth';

const PUBLIC_ROUTES = ['/login'];
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isValid = accessToken ? validateAdminToken(accessToken).isValid : false;

    // Authenticated admin hitting a public route → redirect to dashboard
    if (isPublic && isValid) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Public route, not authenticated → allow through to login page
    if (isPublic) {
        return NextResponse.next();
    }

    // Protected route, valid admin token → allow through
    if (isValid) {
        return NextResponse.next();
    }

    // Access token expired/missing but refresh token exists → try silent refresh
    if (refreshToken) {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({refreshToken}),
            });

            if (res.ok) {
                const envelope = await res.json();
                const data = envelope.data;

                // Validate the new token is still an ADMIN
                if (!validateAdminToken(data.token).isValid) {
                    return clearAndRedirect(request);
                }

                const response = NextResponse.redirect(request.url);
                response.cookies.set('accessToken', data.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: data.expiresIn,
                });
                response.cookies.set('refreshToken', data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: data.refreshExpiresIn,
                });
                return response;
            }
        } catch {
            // Refresh failed — fall through to redirect
        }
    }

    return clearAndRedirect(request);
}

function clearAndRedirect(request: NextRequest): NextResponse {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
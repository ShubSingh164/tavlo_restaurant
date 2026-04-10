/**
 * Tavlo — Auth Login API Route
 *
 * POST /api/auth/login
 *
 * Authenticates a user and returns JWT tokens.
 * Mirrors: tavlo-nest's POST /auth/login
 *
 * Request Body: { email: string, password: string }
 * Headers: x-platform-type: "dashboard" | "portal"
 * Response: { responseInfo: {...}, data: { accessToken, refreshToken } }
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES, Role, PlatformType } from '@/lib/constants';
import * as usersService from '@/lib/services/users.service';

// ─── JWT Config (same as tavlo-nest) ─────────────────────────────────────────

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    return secret;
}

// ─── Platform Access Validation ──────────────────────────────────────────────
// Same as tavlo-nest's AuthService.validatePlatformAccess

function validatePlatformAccess(roles: Role[], platform: PlatformType): void {
    if (platform === PlatformType.PORTAL) {
        if (!roles.includes(Role.CUSTOMER)) {
            throw new AppError({
                ...ERROR_RESPONSES.UNAUTHORIZED_ACCESS,
                message: 'Portal access restricted to Customers.',
            });
        }
    } else if (platform === PlatformType.DASHBOARD) {
        const allowedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.STAFF];
        const hasAccess = roles.some((role) => allowedRoles.includes(role));
        if (!hasAccess) {
            throw new AppError({
                ...ERROR_RESPONSES.UNAUTHORIZED_ACCESS,
                message: 'Dashboard access restricted to Administration staff.',
            });
        }
    }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        // Get platform type from header (same as NestJS)
        const platform = (request.headers.get('x-platform-type') || 'dashboard') as PlatformType;

        // Validate credentials
        const user = await usersService.validateUser(email, password);
        if (!user) {
            throw new AppError(ERROR_RESPONSES.INVALID_CREDENTIALS);
        }

        // Validate platform access
        validatePlatformAccess(user.roles, platform);

        // Generate JWT tokens (same payload structure as NestJS)
        const secret = getJwtSecret();
        const payload = {
            username: user.email,
            sub: user._id?.toString(),
            roles: user.roles,
        };

        const [accessToken, refreshToken] = await Promise.all([
            jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn: '15m' }),
            jwt.sign({ ...payload, type: 'refresh' }, secret, { expiresIn: '7d' }),
        ]);

        return NextResponse.json(
            {
                responseInfo: SUCCESS_RESPONSES.LOGIN_SUCCESS,
                data: { accessToken, refreshToken },
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

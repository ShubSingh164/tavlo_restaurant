/**
 * Tavlo — Shared Constants
 *
 * Direct port of tavlo-nest's:
 *   - common/enums/role.enum.ts
 *   - common/enums/platform-type.enum.ts
 *   - common/constants/success-response.constants.ts
 *   - common/constants/error-response.constants.ts
 *   - onboarding/entities/onboarding-request.entity.ts (OnboardingStatus)
 *
 * @module constants
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    STAFF = 'staff',
    CUSTOMER = 'customer',
}

export enum PlatformType {
    DASHBOARD = 'dashboard',
    PORTAL = 'portal',
}

export enum OnboardingStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    COMPLETED = 'completed',
}

// ─── Success Responses ───────────────────────────────────────────────────────

export const SUCCESS_RESPONSES = {
    SUCCESS: {
        code: 'SUCCESS',
        message: 'Operation successful',
        statusCode: 200,
    },
    REGISTRATION_SUCCESS: {
        code: 'REGISTRATION_SUCCESS',
        message: 'User registration successful',
        statusCode: 201,
    },
    LOGIN_SUCCESS: {
        code: 'LOGIN_SUCCESS',
        message: 'Login successful',
        statusCode: 200,
    },
    OTP_SENT: {
        code: 'OTP_SENT',
        message: 'OTP sent successfully',
        statusCode: 200,
    },
    OTP_VERIFIED: {
        code: 'OTP_VERIFIED',
        message: 'OTP verified successfully',
        statusCode: 200,
    },
    ONBOARDING_COMPLETED: {
        code: 'ONBOARDING_COMPLETED',
        message: 'Onboarding completed successfully',
        statusCode: 200,
    },
} as const;

// ─── Error Responses ─────────────────────────────────────────────────────────

export const ERROR_RESPONSES = {
    INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        statusCode: 500,
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 400,
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        statusCode: 401,
    },
    UNAUTHORIZED_ACCESS: {
        code: 'UNAUTHORIZED_ACCESS',
        message: 'Unauthorized access',
        statusCode: 401,
    },
    USER_EXISTS: {
        code: 'USER_EXISTS',
        message: 'User already exists',
        statusCode: 409,
    },
    RESOURCE_NOT_FOUND: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'Resource not found',
        statusCode: 404,
    },
    OTP_EXPIRED: {
        code: 'OTP_EXPIRED',
        message: 'OTP expired or invalid.',
        statusCode: 400,
    },
    OTP_INVALID: {
        code: 'OTP_INVALID',
        message: 'Invalid OTP.',
        statusCode: 400,
    },
    OTP_RATE_LIMITED: {
        code: 'OTP_RATE_LIMITED',
        message: 'Too many OTP requests. Please wait.',
        statusCode: 429,
    },
    OTP_MAX_RETRIES: {
        code: 'OTP_MAX_RETRIES',
        message: 'Too many failed attempts. OTP invalidated.',
        statusCode: 429,
    },
    EMAIL_NOT_VERIFIED: {
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email not verified',
        statusCode: 401,
    },
    ONBOARDING_FAILED: {
        code: 'ONBOARDING_FAILED',
        message: 'Onboarding failed',
        statusCode: 400,
    },
} as const;

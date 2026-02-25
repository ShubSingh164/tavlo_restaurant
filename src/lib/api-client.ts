/**
 * Tavlo - API Client
 * 
 * Typed fetch wrapper for communicating with the NestJS backend.
 * - Routes through Next.js rewrites (/api/backend/*)
 * - Adds x-platform-type header (required by backend)
 * - Sends credentials (HttpOnly cookies) automatically
 * - Parses standardized { code, message, data } response
 */

// ─── Types ───────────────────────────────────────────────────────────────

export type PlatformType = 'dashboard' | 'portal';

export interface ApiResponse<T = unknown> {
    code: string;
    message: string;
    data: T;
    _meta?: Record<string, unknown>;
}

export class ApiError extends Error {
    code: string;
    statusCode: number;
    data: unknown;

    constructor(code: string, message: string, statusCode: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.statusCode = statusCode;
        this.data = data;
    }
}

// ─── Base URL ─────────────────────────────────────────────────────────────
// All requests are routed through Next.js rewrites (see next.config.ts)
// /api/backend/* → proxied to NestJS backend at http://localhost:3000/*

const BASE_URL = '/api/backend';

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────

async function request<T>(
    method: string,
    path: string,
    options: {
        body?: Record<string, unknown>;
        platform?: PlatformType;
        headers?: Record<string, string>;
    } = {}
): Promise<ApiResponse<T>> {
    const { body, platform = 'dashboard', headers = {} } = options;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        credentials: 'include', // Send HttpOnly cookies
        headers: {
            'Content-Type': 'application/json',
            'x-platform-type': platform,
            ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new ApiError(
            json.code || 'UNKNOWN_ERROR',
            json.message || 'An unexpected error occurred',
            res.status,
            json.data
        );
    }

    return json as ApiResponse<T>;
}

// ─── Public API Methods ───────────────────────────────────────────────────
// Generic HTTP helpers — use these for any new backend endpoints

export const api = {
    get<T>(path: string, platform?: PlatformType) {
        return request<T>('GET', path, { platform });
    },

    post<T>(path: string, body: Record<string, unknown>, platform?: PlatformType) {
        return request<T>('POST', path, { body, platform });
    },

    patch<T>(path: string, body: Record<string, unknown>, platform?: PlatformType) {
        return request<T>('PATCH', path, { body, platform });
    },

    delete<T>(path: string, platform?: PlatformType) {
        return request<T>('DELETE', path, { platform });
    },
};

// ─── Auth-Specific Helpers ─────────────────────────────────────────────────
// Used by: signin/page.tsx, customer-login/page.tsx

export const authApi = {
    /** Dashboard login (admin/manager/staff) */
    loginDashboard(email: string, password: string) {
        return api.post('/auth/login', { email, password }, 'dashboard');
    },

    /** Portal login (customer) */
    loginPortal(email: string, password: string) {
        return api.post('/auth/login', { email, password }, 'portal');
    },

    /** Refresh tokens */
    refresh(platform: PlatformType) {
        return api.post('/auth/refresh', {}, platform);
    },

    /** Logout */
    logout(platform: PlatformType) {
        return api.post('/auth/logout', {}, platform);
    },
};

// ─── Onboarding-Specific Helpers ──────────────────────────────────────────
// 3-step flow: register → verify OTP → complete
// Used by: signup/page.tsx, verify-otp/page.tsx, customer-login/page.tsx
export const onboardingApi = {
    /** Step 1: Register and send OTP */
    register(email: string, phone?: string) {
        return api.post('/onboarding/register', { email, ...(phone ? { phone } : {}) });
    },

    /** Step 2: Verify OTP */
    verifyOtp(email: string, code: string) {
        return api.post('/onboarding/verify-otp', { email, code });
    },

    /** Resend OTP */
    resendOtp(email: string) {
        return api.post('/onboarding/resend-otp', { email });
    },

    /** Step 3: Complete onboarding */
    complete(data: { email: string; password: string; firstName: string; lastName: string; restaurantName: string }) {
        return api.post('/onboarding/complete', data as unknown as Record<string, unknown>);
    },
};

/**
 * Tavlo — API Error Handling
 *
 * Mirrors tavlo-nest's AppException + ResponseInfo interface.
 * Provides a standardized error class and a helper to convert
 * any thrown error into a NextResponse with the correct status code.
 *
 * @module api-error
 */

import { NextResponse } from 'next/server';

// ─── ResponseInfo Interface ──────────────────────────────────────────────────
// Same shape as tavlo-nest's common/interfaces/response.interface.ts

export interface ResponseInfo {
    code: string;
    message: string;
    statusCode: number;
}

// ─── AppError Class ──────────────────────────────────────────────────────────
// Mirrors tavlo-nest's AppException (HttpException subclass)

export class AppError extends Error {
    responseInfo: ResponseInfo;
    data?: unknown;

    constructor(responseInfo: ResponseInfo, data?: unknown) {
        super(responseInfo.message);
        this.name = 'AppError';
        this.responseInfo = responseInfo;
        this.data = data;
    }
}

// ─── Error Response Helper ───────────────────────────────────────────────────
// Converts any thrown error into a standardized NextResponse

export function handleApiError(error: unknown): NextResponse {
    console.error('[API Error]', error);

    if (error instanceof AppError) {
        return NextResponse.json(
            {
                responseInfo: error.responseInfo,
                data: error.data ?? null,
            },
            { status: error.responseInfo.statusCode }
        );
    }

    // Unknown error — return 500
    return NextResponse.json(
        {
            responseInfo: {
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Internal server error',
                statusCode: 500,
            },
            data: null,
        },
        { status: 500 }
    );
}

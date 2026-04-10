/**
 * Tavlo — Onboarding Register API Route
 *
 * POST /api/onboarding/register
 *
 * Step 1 of onboarding: Register a new restaurant lead and send OTP.
 * Mirrors: tavlo-nest's POST /onboarding/register
 *
 * Request Body: { email: string, phone?: string }
 * Response: { responseInfo: {...}, data: { email, message } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES } from '@/lib/constants';
import * as onboardingService from '@/lib/services/onboarding.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone } = body;

        // Validate required fields
        if (!email || typeof email !== 'string') {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        const data = await onboardingService.register(email, phone);

        return NextResponse.json(
            {
                responseInfo: SUCCESS_RESPONSES.OTP_SENT,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Tavlo — Onboarding Verify OTP API Route
 *
 * POST /api/onboarding/verify-otp
 *
 * Step 2 of onboarding: Verify the 6-digit OTP code.
 * Mirrors: tavlo-nest's POST /onboarding/verify-otp
 *
 * Request Body: { email: string, code: string }
 * Response: { responseInfo: {...}, data: { email, status } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES } from '@/lib/constants';
import * as onboardingService from '@/lib/services/onboarding.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        // Validate required fields
        if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        const data = await onboardingService.verifyOtp(email, code);

        return NextResponse.json(
            {
                responseInfo: SUCCESS_RESPONSES.OTP_VERIFIED,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

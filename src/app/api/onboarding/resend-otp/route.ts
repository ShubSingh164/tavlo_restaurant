/**
 * Tavlo — Onboarding Resend OTP API Route
 *
 * POST /api/onboarding/resend-otp
 *
 * Re-sends OTP to an existing onboarding lead.
 * Mirrors: tavlo-nest's POST /onboarding/resend-otp
 *
 * Request Body: { email: string }
 * Response: { responseInfo: {...}, data: { email, message } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES } from '@/lib/constants';
import * as onboardingService from '@/lib/services/onboarding.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate required fields
        if (!email || typeof email !== 'string') {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        const data = await onboardingService.resendOtp(email);

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

/**
 * Tavlo — Onboarding Complete API Route
 *
 * POST /api/onboarding/complete
 *
 * Step 3 of onboarding: Create the Manager account after OTP verification.
 * Mirrors: tavlo-nest's POST /onboarding/complete
 *
 * Request Body: { email, password, firstName, lastName, restaurantName }
 * Response: { responseInfo: {...}, data: { user, message } }
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES } from '@/lib/constants';
import * as onboardingService from '@/lib/services/onboarding.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, restaurantName } = body;

        // Validate required fields
        if (
            !email || typeof email !== 'string' ||
            !password || typeof password !== 'string' ||
            !firstName || typeof firstName !== 'string' ||
            !lastName || typeof lastName !== 'string' ||
            !restaurantName || typeof restaurantName !== 'string'
        ) {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        const data = await onboardingService.complete({
            email,
            password,
            firstName,
            lastName,
            restaurantName,
        });

        return NextResponse.json(
            {
                responseInfo: SUCCESS_RESPONSES.ONBOARDING_COMPLETED,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

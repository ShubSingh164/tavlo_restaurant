/**
 * Tavlo — Restaurant Onboarding API Routes
 *
 * GET  /api/restaurant?email=... — Get restaurant data for the logged-in user
 * POST /api/restaurant           — Save/update a step of onboarding data
 *
 * Used by all 6 onboarding pages to persist form data to MongoDB.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, AppError } from '@/lib/api-error';
import { SUCCESS_RESPONSES, ERROR_RESPONSES } from '@/lib/constants';
import * as restaurantService from '@/lib/services/restaurant.service';

// ─── GET: Fetch restaurant data ──────────────────────────────────────────────
// Query params: ?email=user@example.com

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get('email');
        if (!email) {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        const restaurant = await restaurantService.getByEmail(email);

        return NextResponse.json(
            {
                responseInfo: SUCCESS_RESPONSES.SUCCESS,
                data: restaurant,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

// ─── POST: Save/update onboarding step data ─────────────────────────────────
// Body: { email, ownerId?, step, data: { ...fields } }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, ownerId, step, data, goLive } = body;

        if (!email || typeof email !== 'string') {
            throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
        }

        // Handle "Go Live" action (step 6 review)
        if (goLive) {
            const restaurant = await restaurantService.goLive(email);
            return NextResponse.json(
                {
                    responseInfo: {
                        code: 'RESTAURANT_LIVE',
                        message: 'Restaurant is now live!',
                        statusCode: 200,
                    },
                    data: restaurant,
                },
                { status: 200 }
            );
        }

        // Ensure restaurant exists (create if first time)
        if (ownerId) {
            await restaurantService.getOrCreateRestaurant(email, ownerId);
        }

        // Update step data
        if (step && data) {
            const restaurant = await restaurantService.updateStep(email, step, data);
            return NextResponse.json(
                {
                    responseInfo: SUCCESS_RESPONSES.SUCCESS,
                    data: restaurant,
                },
                { status: 200 }
            );
        }

        throw new AppError(ERROR_RESPONSES.VALIDATION_ERROR);
    } catch (error) {
        return handleApiError(error);
    }
}

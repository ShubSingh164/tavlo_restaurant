/**
 * Tavlo — Onboarding Service
 *
 * Direct port of tavlo-nest's onboarding/onboarding.service.ts
 *
 * Orchestrates the 3-step admin onboarding flow:
 *   Step 1: register()   — Create lead, generate OTP, send email
 *   Step 2: verifyOtp()  — Validate OTP, mark email as verified
 *   Step 3: complete()   — Create user account with MANAGER role
 *
 * Also: resendOtp() — Re-send OTP to existing lead
 *
 * @module services/onboarding
 */

import { connectDB } from '../db';
import { OnboardingRequest } from '../models/onboarding-request.model';
import { AppError } from '../api-error';
import { ERROR_RESPONSES, OnboardingStatus, Role } from '../constants';
import * as otpService from './otp.service';
import * as notificationService from './notification.service';
import * as usersService from './users.service';
import * as restaurantService from './restaurant.service';

// ─── Step 1: Register ────────────────────────────────────────────────────────
// Same as tavlo-nest's OnboardingService.register

export async function register(email: string, phone?: string) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await usersService.findOneByEmail(normalizedEmail);
    if (existingUser) {
        throw new AppError(ERROR_RESPONSES.USER_EXISTS);
    }

    // Generate OTP
    const otp = await otpService.generateOtp(normalizedEmail);

    // Create or Update Onboarding Request (upsert)
    await OnboardingRequest.updateOne(
        { email: normalizedEmail },
        {
            email: normalizedEmail,
            phone: phone || undefined,
            status: OnboardingStatus.PENDING,
            isEmailVerified: false,
        },
        { upsert: true }
    );

    // Send OTP via email
    await notificationService.sendEmail(
        normalizedEmail,
        'Your Verification Code',
        `Your OTP is: ${otp}`
    );

    // Send OTP via SMS if phone provided
    if (phone) {
        await notificationService.sendSms(phone, `Your OTP is: ${otp}`);
    }

    return { email: normalizedEmail, message: 'OTP sent successfully' };
}

// ─── Resend OTP ──────────────────────────────────────────────────────────────
// Same as tavlo-nest's OnboardingService.resendOtp

export async function resendOtp(email: string) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();

    const request = await OnboardingRequest.findOne({ email: normalizedEmail });
    if (!request) {
        throw new AppError(ERROR_RESPONSES.RESOURCE_NOT_FOUND);
    }

    const otp = await otpService.generateOtp(normalizedEmail);
    await notificationService.sendEmail(
        normalizedEmail,
        'Your Verification Code',
        `Your OTP is: ${otp}`
    );

    return { email: normalizedEmail, message: 'OTP resent successfully' };
}

// ─── Step 2: Verify OTP ──────────────────────────────────────────────────────
// Same as tavlo-nest's OnboardingService.verifyOtp

export async function verifyOtp(email: string, code: string) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();

    const isValid = await otpService.validateOtp(normalizedEmail, code);
    if (!isValid) {
        throw new AppError(ERROR_RESPONSES.INVALID_CREDENTIALS);
    }

    await OnboardingRequest.updateOne(
        { email: normalizedEmail },
        {
            status: OnboardingStatus.VERIFIED,
            isEmailVerified: true,
        }
    );

    return { email: normalizedEmail, status: OnboardingStatus.VERIFIED };
}

// ─── Step 3: Complete Onboarding ─────────────────────────────────────────────
// Same as tavlo-nest's OnboardingService.complete

export async function complete(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    restaurantName: string;
}) {
    await connectDB();
    const normalizedEmail = data.email.toLowerCase().trim();

    const request = await OnboardingRequest.findOne({ email: normalizedEmail });
    if (!request || request.status !== OnboardingStatus.VERIFIED) {
        throw new AppError({
            ...ERROR_RESPONSES.EMAIL_NOT_VERIFIED,
            message: 'Email not verified',
        });
    }

    try {
        // Create User with MANAGER role
        const user = await usersService.createUser({
            email: normalizedEmail,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: [Role.MANAGER],
        });

        // Create Restaurant record linked to this user
        const restaurant = await restaurantService.getOrCreateRestaurant(
            normalizedEmail,
            (user._id as unknown as string).toString()
        );

        // Set the restaurant name from signup form
        if (data.restaurantName) {
            await restaurantService.updateStep(normalizedEmail, 1, {
                restaurantName: data.restaurantName,
            });
        }

        // Mark onboarding as completed
        request.status = OnboardingStatus.COMPLETED;
        await request.save();

        return {
            user: { email: user.email, roles: user.roles, _id: user._id },
            restaurant: { _id: restaurant._id },
            message: 'Onboarding completed successfully',
        };
    } catch (error) {
        throw new AppError({
            code: 'ONBOARDING_FAILED',
            message: (error as Error).message || 'Onboarding failed',
            statusCode: 400,
        });
    }
}

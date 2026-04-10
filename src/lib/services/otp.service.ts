/**
 * Tavlo — OTP Service
 *
 * Direct port of tavlo-nest's otp/otp.service.ts
 *
 * Uses MongoDB (Otp model) instead of Redis for OTP storage.
 * Same rate limits and logic:
 *   - 5-minute TTL for OTP codes
 *   - Max 3 resend attempts within 10 minutes
 *   - Max 5 validation retries before invalidation
 *
 * @module services/otp
 */

import crypto from 'crypto';
import { connectDB } from '../db';
import { Otp } from '../models/otp.model';
import { AppError } from '../api-error';
import { ERROR_RESPONSES } from '../constants';

// ─── Config (same as tavlo-nest) ─────────────────────────────────────────────

const OTP_TTL_SECONDS = 300;          // 5 minutes
const MAX_RESEND_ATTEMPTS = 3;
const MAX_RETRY_ATTEMPTS = 5;

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Generate a new 6-digit OTP for the given identifier (email).
 *
 * If an OTP already exists for this email:
 *   - If resend limit is reached → throw rate limit error
 *   - Otherwise → increment resend count and update code
 *
 * If no OTP exists → create a new one.
 *
 * @returns The generated 6-digit OTP string
 */
export async function generateOtp(identifier: string): Promise<string> {
    await connectDB();
    const normalizedId = identifier.toLowerCase().trim();

    // Check existing OTP record
    const existing = await Otp.findOne({ identifier: normalizedId });

    if (existing && existing.resendCount >= MAX_RESEND_ATTEMPTS) {
        console.warn(`[OTP] Rate limit reached for ${normalizedId}`);
        throw new AppError(ERROR_RESPONSES.OTP_RATE_LIMITED);
    }

    // Generate random 6-digit code (same as NestJS: crypto.randomInt)
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    if (existing) {
        // Update existing record
        existing.code = code;
        existing.retryAttempts = 0; // Reset retries on new OTP
        existing.resendCount += 1;
        existing.expiresAt = expiresAt;
        await existing.save();
    } else {
        // Create new OTP record
        await Otp.create({
            identifier: normalizedId,
            code,
            retryAttempts: 0,
            resendCount: 1,
            expiresAt,
        });
    }

    console.log(`[OTP] Generated OTP for ${normalizedId}: ${code}`);
    return code;
}

/**
 * Validate an OTP code for the given identifier (email).
 *
 * Checks:
 *   1. Too many failed attempts → invalidate OTP
 *   2. No OTP found (expired or never created) → error
 *   3. Wrong code → increment retry count
 *   4. Correct code → clean up and return true
 *
 * @returns true if OTP is valid
 * @throws AppError if invalid
 */
export async function validateOtp(identifier: string, code: string): Promise<boolean> {
    await connectDB();
    const normalizedId = identifier.toLowerCase().trim();

    const otpRecord = await Otp.findOne({ identifier: normalizedId });

    if (!otpRecord) {
        throw new AppError(ERROR_RESPONSES.OTP_EXPIRED);
    }

    // Check retry limit
    if (otpRecord.retryAttempts >= MAX_RETRY_ATTEMPTS) {
        await Otp.deleteOne({ identifier: normalizedId });
        throw new AppError(ERROR_RESPONSES.OTP_MAX_RETRIES);
    }

    // Check code match
    if (otpRecord.code !== code) {
        otpRecord.retryAttempts += 1;
        await otpRecord.save();
        throw new AppError(ERROR_RESPONSES.OTP_INVALID);
    }

    // ✅ Success — clean up
    await Otp.deleteOne({ identifier: normalizedId });
    console.log(`[OTP] Validated OTP for ${normalizedId}`);
    return true;
}

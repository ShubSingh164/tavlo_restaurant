/**
 * Tavlo — OTP Mongoose Model
 *
 * Replaces tavlo-nest's Redis-based OTP storage with a MongoDB collection.
 * Uses a TTL index for automatic expiry (same 5-minute TTL as NestJS).
 *
 * @module models/otp
 */

import mongoose, { Schema, Document } from 'mongoose';

// ─── TypeScript Interface ────────────────────────────────────────────────────

export interface IOtp extends Document {
    identifier: string;      // Email address
    code: string;            // 6-digit OTP
    retryAttempts: number;   // Failed validation attempts
    resendCount: number;     // Number of times OTP was resent
    expiresAt: Date;         // Auto-deleted after this time
    createdAt: Date;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const OtpSchema = new Schema<IOtp>(
    {
        identifier: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
        },
        retryAttempts: {
            type: Number,
            default: 0,
        },
        resendCount: {
            type: Number,
            default: 1, // First generation counts as 1
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // MongoDB TTL index — auto-deletes at expiresAt
        },
    },
    { timestamps: true }
);

// ─── Model ───────────────────────────────────────────────────────────────────

export const Otp =
    mongoose.models.Otp ||
    mongoose.model<IOtp>('Otp', OtpSchema);

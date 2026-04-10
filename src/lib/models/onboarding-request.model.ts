/**
 * Tavlo — OnboardingRequest Mongoose Model
 *
 * Direct port of tavlo-nest's:
 *   onboarding/entities/onboarding-request.entity.ts
 *
 * Tracks the onboarding lifecycle: PENDING → VERIFIED → COMPLETED
 *
 * @module models/onboarding-request
 */

import mongoose, { Schema, Document } from 'mongoose';
import { OnboardingStatus } from '../constants';

// ─── TypeScript Interface ────────────────────────────────────────────────────

export interface IOnboardingRequest extends Document {
    email: string;
    phone?: string;
    status: OnboardingStatus;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const OnboardingRequestSchema = new Schema<IOnboardingRequest>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            default: undefined,
        },
        status: {
            type: String,
            enum: Object.values(OnboardingStatus),
            default: OnboardingStatus.PENDING,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// ─── Model ───────────────────────────────────────────────────────────────────
// Use existing model if already compiled (Next.js hot-reload safe)

export const OnboardingRequest =
    mongoose.models.OnboardingRequest ||
    mongoose.model<IOnboardingRequest>('OnboardingRequest', OnboardingRequestSchema);

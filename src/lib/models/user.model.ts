/**
 * Tavlo — User Mongoose Model
 *
 * Direct port of tavlo-nest's:
 *   users/entities/user.entity.ts
 *
 * @module models/user
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../constants';

// ─── TypeScript Interface ────────────────────────────────────────────────────

export interface IUser extends Document {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Not returned by default (same as NestJS)
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        roles: {
            type: [String],
            enum: Object.values(Role),
            default: [Role.CUSTOMER],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// ─── Model ───────────────────────────────────────────────────────────────────

export const User =
    mongoose.models.User ||
    mongoose.model<IUser>('User', UserSchema);

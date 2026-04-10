/**
 * Tavlo — Restaurant Service
 *
 * CRUD operations for restaurant onboarding data.
 * Each user (owner) has exactly one restaurant profile.
 *
 * @module services/restaurant
 */

import { connectDB } from '../db';
import { Restaurant, IRestaurant } from '../models/restaurant.model';
import { AppError } from '../api-error';
import { ERROR_RESPONSES } from '../constants';
import mongoose from 'mongoose';

// ─── Get or Create Restaurant ────────────────────────────────────────────────
// Finds existing restaurant by ownerEmail, or creates a new one

export async function getOrCreateRestaurant(
    ownerEmail: string,
    ownerId: string
): Promise<IRestaurant> {
    await connectDB();
    const email = ownerEmail.toLowerCase().trim();

    let restaurant = await Restaurant.findOne({ ownerEmail: email });

    if (!restaurant) {
        restaurant = await Restaurant.create({
            ownerId: new mongoose.Types.ObjectId(ownerId),
            ownerEmail: email,
            onboardingStep: 0,
        });
        console.log(`[Restaurant] Created new restaurant profile for ${email}`);
    }

    return restaurant;
}

// ─── Get Restaurant by Email ─────────────────────────────────────────────────

export async function getByEmail(ownerEmail: string): Promise<IRestaurant | null> {
    await connectDB();
    return Restaurant.findOne({ ownerEmail: ownerEmail.toLowerCase().trim() });
}

// ─── Update Step Data ────────────────────────────────────────────────────────
// Updates the restaurant with data from a specific onboarding step

export async function updateStep(
    ownerEmail: string,
    step: number,
    data: Record<string, unknown>
): Promise<IRestaurant> {
    await connectDB();
    const email = ownerEmail.toLowerCase().trim();

    const restaurant = await Restaurant.findOne({ ownerEmail: email });
    if (!restaurant) {
        throw new AppError(ERROR_RESPONSES.RESOURCE_NOT_FOUND);
    }

    // Update fields from the step data
    Object.keys(data).forEach((key) => {
        if (key in restaurant.schema.paths && key !== '_id' && key !== 'ownerId' && key !== 'ownerEmail') {
            (restaurant as Record<string, unknown>)[key] = data[key];
        }
    });

    // Only advance step if this is the latest step
    if (step > restaurant.onboardingStep) {
        restaurant.onboardingStep = step;
    }

    await restaurant.save();
    console.log(`[Restaurant] Updated step ${step} for ${email}`);
    return restaurant;
}

// ─── Go Live ─────────────────────────────────────────────────────────────────
// Mark restaurant as live (step 6 — review complete)

export async function goLive(ownerEmail: string): Promise<IRestaurant> {
    await connectDB();
    const email = ownerEmail.toLowerCase().trim();

    const restaurant = await Restaurant.findOne({ ownerEmail: email });
    if (!restaurant) {
        throw new AppError(ERROR_RESPONSES.RESOURCE_NOT_FOUND);
    }

    restaurant.isLive = true;
    restaurant.onboardingStep = 6;
    await restaurant.save();

    console.log(`[Restaurant] 🚀 ${email} is now LIVE!`);
    return restaurant;
}

// ─── Get All Restaurants (for admin dashboard) ───────────────────────────────

export async function getAll(): Promise<IRestaurant[]> {
    await connectDB();
    return Restaurant.find().sort({ createdAt: -1 }).exec();
}

/**
 * Tavlo — Restaurant Mongoose Model
 *
 * Stores all onboarding data from the 6-step wizard:
 *   Step 1: Basic Details (name, type, cuisine, logo, year)
 *   Step 2: Location & Contact (address, city, state, pincode, phone, owner, email)
 *   Step 3: Legal & Business (businessType, GST, FSSAI, PAN, legalName)
 *   Step 4: Operations (hours, service types, capacity, prep time)
 *   Step 5: Payment (methods, bank account details)
 *   Step 6: Review & Go Live (isLive flag)
 *
 * Each restaurant is linked to a User (owner) via the `ownerId` field.
 * The `onboardingStep` tracks which step the user has completed.
 *
 * @module models/restaurant
 */

import mongoose, { Schema, Document } from 'mongoose';

// ─── TypeScript Interface ────────────────────────────────────────────────────

export interface IRestaurant extends Document {
    ownerId: mongoose.Types.ObjectId;   // Linked to User model
    ownerEmail: string;                 // Denormalized for easy lookup
    onboardingStep: number;             // Last completed step (1–6)
    isLive: boolean;                    // Set to true after "Go Live"

    // Step 1: Basic Details
    restaurantName: string;
    restaurantType: string;
    cuisineType: string[];
    yearEstablished: string;

    // Step 2: Location & Contact
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    ownerName: string;
    supportEmail: string;

    // Step 3: Legal & Business
    businessType: string;
    gstNo: string;
    fssaiNo: string;
    panNo: string;
    legalName: string;

    // Step 4: Operations
    openTime: string;
    closeTime: string;
    dineInEnabled: boolean;
    takeawayEnabled: boolean;
    deliveryEnabled: boolean;
    seatingCapacity: string;
    avgPrepTime: string;

    // Step 5: Payment
    paymentMethods: string[];
    accountHolder: string;
    accountNo: string;
    ifscCode: string;
    bankLegalName: string;

    createdAt: Date;
    updatedAt: Date;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const RestaurantSchema = new Schema<IRestaurant>(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        ownerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
        onboardingStep: { type: Number, default: 0 },
        isLive: { type: Boolean, default: false },

        // Step 1
        restaurantName: { type: String, default: '' },
        restaurantType: { type: String, default: '' },
        cuisineType: { type: [String], default: [] },
        yearEstablished: { type: String, default: '' },

        // Step 2
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
        phone: { type: String, default: '' },
        ownerName: { type: String, default: '' },
        supportEmail: { type: String, default: '' },

        // Step 3
        businessType: { type: String, default: '' },
        gstNo: { type: String, default: '' },
        fssaiNo: { type: String, default: '' },
        panNo: { type: String, default: '' },
        legalName: { type: String, default: '' },

        // Step 4
        openTime: { type: String, default: '' },
        closeTime: { type: String, default: '' },
        dineInEnabled: { type: Boolean, default: true },
        takeawayEnabled: { type: Boolean, default: true },
        deliveryEnabled: { type: Boolean, default: true },
        seatingCapacity: { type: String, default: '' },
        avgPrepTime: { type: String, default: '' },

        // Step 5
        paymentMethods: { type: [String], default: ['upi', 'card', 'cash'] },
        accountHolder: { type: String, default: '' },
        accountNo: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        bankLegalName: { type: String, default: '' },
    },
    { timestamps: true }
);

// ─── Model ───────────────────────────────────────────────────────────────────

export const Restaurant =
    mongoose.models.Restaurant ||
    mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

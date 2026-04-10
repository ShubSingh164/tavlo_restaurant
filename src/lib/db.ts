/**
 * Tavlo — MongoDB Connection (Singleton)
 *
 * Uses Mongoose to connect to MongoDB. Connection is cached in a global
 * variable to survive Next.js hot-reloads in development and to prevent
 * opening multiple connections in serverless environments.
 *
 * Same MongoDB instance as tavlo-nest (Docker, port 27018).
 *
 * @module db
 */

import mongoose from 'mongoose';

// ─── Global Cache ────────────────────────────────────────────────────────────
// In development, Next.js hot-reloads clear the module cache on every change.
// Storing the connection promise in `globalThis` prevents re-connecting.

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? { conn: null, promise: null };
globalThis.mongooseCache = cached;

// ─── Connect ─────────────────────────────────────────────────────────────────

export async function connectDB(): Promise<typeof mongoose> {
    // Return cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error(
            '❌ MONGO_URI is not defined in environment variables. ' +
            'Add it to .env.local (e.g. mongodb://root:password@localhost:27018/tavlo?authSource=admin)'
        );
    }

    // Reuse existing connection promise if one is already in-flight
    if (!cached.promise) {
        console.log('🔌 Connecting to MongoDB...');
        cached.promise = mongoose
            .connect(MONGO_URI, {
                bufferCommands: false, // Don't buffer commands when disconnected
            })
            .then((m) => {
                console.log('✅ MongoDB connected successfully');
                return m;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

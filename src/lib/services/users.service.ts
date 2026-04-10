/**
 * Tavlo — Users Service
 *
 * Direct port of tavlo-nest's users/users.service.ts
 *
 * Handles user CRUD operations and password hashing.
 * Also seeds the default Super Admin user on first call.
 *
 * @module services/users
 */

import bcrypt from 'bcryptjs';
import { connectDB } from '../db';
import { User, IUser } from '../models/user.model';
import { Role } from '../constants';

// ─── Super Admin Seeding ─────────────────────────────────────────────────────
// Same logic as tavlo-nest's onModuleInit

let superAdminSeeded = false;

async function seedSuperAdmin(): Promise<void> {
    if (superAdminSeeded) return;

    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.warn('[Users] Super Admin credentials not found. Skipping seeding.');
        superAdminSeeded = true;
        return;
    }

    const adminExists = await User.findOne({ roles: Role.SUPER_ADMIN });
    if (!adminExists) {
        console.log('[Users] Seeding default Super Admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        try {
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                roles: [Role.SUPER_ADMIN],
            });
            console.log(`[Users] ✅ Super Admin created: ${adminEmail}`);
        } catch (error) {
            console.error('[Users] ❌ Failed to seed Super Admin:', error);
        }
    } else {
        console.log('[Users] Super Admin already exists.');
    }

    superAdminSeeded = true;
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Find a user by email. Includes password field for authentication.
 * Same as tavlo-nest's findOneByEmail.
 */
export async function findOneByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    await seedSuperAdmin();
    return User.findOne({ email: email.toLowerCase().trim() }).select('+password').exec();
}

/**
 * Create a new user with hashed password.
 * Same as tavlo-nest's create method.
 */
export async function createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: Role[];
}): Promise<IUser> {
    await connectDB();
    await seedSuperAdmin();

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
        ...data,
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
    });

    return user;
}

/**
 * Validate user credentials for login.
 * Same as tavlo-nest's AuthService.validateUser.
 *
 * @returns User object without password if valid, null otherwise
 */
export async function validateUser(
    email: string,
    password: string
): Promise<IUser | null> {
    const user = await findOneByEmail(email);
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return userObj as IUser;
}

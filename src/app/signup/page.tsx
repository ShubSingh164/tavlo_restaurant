'use client';

/**
 * Tavlo Restaurant ERP - Sign Up Page
 * 
 * Modern registration page with:
 * - Card-based layout matching onboarding theme
 * - Feature showcase on the right
 * - Google OAuth option
 * - Name, email, password fields with icons
 * 
 * @component SignUpPage
 * @route /signup
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// BACKEND INTEGRATION: API client for onboarding flow (register → OTP → complete)
import { onboardingApi, ApiError } from '@/lib/api-client';

// ─── SVG Icons ──────────────────────────────────────────────────────────────
// Inline SVG icons used in form inputs and benefits showcase.
// These are defined as React components for reusability and easy styling.
const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

// Eye icons for password visibility toggle
const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
);

export default function SignUpPage() {
    // ─── Navigation ───────────────────────────────────────────────────────────
    const router = useRouter(); // Used to redirect after successful registration

    // ─── Form State ───────────────────────────────────────────────────────────
    const [firstName, setFirstName] = useState('');       // User's first name
    const [lastName, setLastName] = useState('');         // User's last name
    const [email, setEmail] = useState('');               // Email — sent to backend for OTP
    const [phone, setPhone] = useState('');               // Phone number (optional)
    const [password, setPassword] = useState('');         // Password — stored in sessionStorage, used in Step 3
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [agreedToTerms, setAgreedToTerms] = useState(false); // Terms & Conditions checkbox
    const [error, setError] = useState('');               // API error message displayed in form
    const [isLoading, setIsLoading] = useState(false);    // Loading spinner state for submit button

    /**
     * BACKEND INTEGRATION: Onboarding Registration (Step 1 of 3)
     * 
     * Calls POST /onboarding/register on the NestJS backend.
     * This creates an onboarding request and sends an OTP to the user's email.
     * 
     * Flow: Register → OTP sent to email → Redirect to /verify-otp
     * 
     * Form data (name, password) is stored in sessionStorage because it's
     * needed later in Step 3 (onboarding/complete) after OTP verification.
     * 
     * API: POST /api/backend/onboarding/register
     * Body: { email, phone? }
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // BACKEND: Register and send OTP to user's email
            await onboardingApi.register(email, phone || undefined);

            // Store form data in sessionStorage for the onboarding/complete step later
            sessionStorage.setItem('tavlo_onboarding', JSON.stringify({
                email, firstName, lastName, password, phone
            }));

            // Navigate to OTP verification page
            router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=onboarding`);
        } catch (err) {
            // BACKEND: Display API error message (e.g., "Email already registered")
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Benefits List (shown on right panel) ──────────────────────────────
    const benefits = [
        'Free 14-day trial, no credit card required',
        'Manage unlimited orders and staff',
        'Real-time analytics and insights',
        '24/7 customer support',
        'Mobile app for on-the-go management',
    ];

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>

                {/* ── Left Section: Registration Form ───────────────────────── */}
                <div className={styles.formSection}>
                    <div className={styles.formContent}>

                        {/* Logo */}
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/images/tavlo-logo.png"
                                alt="Tavlo"
                                width={140}
                                height={50}
                                className={styles.logo}
                            />
                        </div>

                        {/* Page Title & Subtitle */}
                        <div className={styles.headerSection}>
                            <h1 className={styles.title}>Create your account</h1>
                            <p className={styles.subtitle}>
                                Join thousands of restaurants already using Tavlo
                            </p>
                        </div>

                        {/* Google OAuth Button — TODO: wire to Google OAuth flow */}
                        <button className={styles.googleBtn}>
                            <Image src="/google.svg" alt="Google" width={20} height={20} />
                            Continue with Google
                        </button>

                        {/* Divider between OAuth and registration form */}
                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>OR</span>
                            <span className={styles.dividerLine}></span>
                        </div>

                        {/* ── Registration Form ───────────────────────────────── */}
                        <form className={styles.form} onSubmit={handleSubmit}>

                            {/* First & Last Name (side by side) */}
                            <div className={styles.nameRow}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.inputIcon}><UserIcon /></span>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            className={styles.input}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Last Name</label>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.inputIcon}><UserIcon /></span>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className={styles.input}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}><EmailIcon /></span>
                                    <input
                                        type="email"
                                        placeholder="you@restaurant.com"
                                        className={styles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number Input (optional) */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}><PhoneIcon /></span>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className={styles.input}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Input with visibility toggle */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Password</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}><LockIcon /></span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        className={styles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms & Conditions Checkbox */}
                            <label className={styles.termsCheckbox}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    required
                                />
                                <span className={styles.termsText}>
                                    I agree to Tavlo's{' '}
                                    <Link href="/terms">Terms of Service</Link> and{' '}
                                    <Link href="/privacy">Privacy Policy</Link>
                                </span>
                            </label>

                            {/* Submit Button — triggers backend registration */}
                            <button type="submit" className={styles.submitBtn}>
                                Create Account
                            </button>
                        </form>

                        {/* Link to Sign In page for existing users */}
                        <p className={styles.switchText}>
                            Already have an account?{' '}
                            <Link href="/signin" className={styles.switchLink}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ── Right Section: Benefits Showcase ───────────────────── */}
                {/* Shows key selling points and platform stats to encourage sign-up */}
                <div className={styles.showcaseSection}>
                    <div className={styles.showcaseContent}>
                        <div className={styles.benefitsHeader}>
                            <h2 className={styles.benefitsTitle}>Why choose Tavlo?</h2>
                            <p className={styles.benefitsSubtitle}>
                                Everything you need to manage and grow your restaurant
                            </p>
                        </div>

                        {/* Benefits Checklist */}
                        <div className={styles.benefitsList}>
                            {benefits.map((benefit, index) => (
                                <div key={index} className={styles.benefitItem}>
                                    <span className={styles.benefitIcon}>
                                        <CheckCircleIcon />
                                    </span>
                                    <span className={styles.benefitText}>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Platform Statistics */}
                        <div className={styles.statsSection}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>2,500+</span>
                                <span className={styles.statLabel}>Restaurants</span>
                            </div>
                            <div className={styles.statDivider}></div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>1M+</span>
                                <span className={styles.statLabel}>Orders Processed</span>
                            </div>
                            <div className={styles.statDivider}></div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>4.9★</span>
                                <span className={styles.statLabel}>User Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

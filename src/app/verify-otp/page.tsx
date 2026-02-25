'use client';

/**
 * Tavlo Restaurant ERP - OTP Verification Page
 * 
 * Modern verification page with:
 * - Card-based layout matching signin/signup theme
 * - 6-digit OTP input boxes
 * - Security showcase on the right
 * - Resend code functionality
 * 
 * @component VerifyOTPPage
 * @route /verify-otp
 */

// ─── Dependencies ───────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Next.js client-side navigation
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// BACKEND INTEGRATION: API client for OTP verification and onboarding completion
import { onboardingApi, ApiError } from '@/lib/api-client';

// ─── SVG Icons ──────────────────────────────────────────────────────────────
// Inline SVG icons used in the security info sidebar.
// ShieldIcon, LockIcon, CheckIcon — for security features
// MailIcon — large icon in the email verification header
const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const LockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12" />
    </svg>
);

const MailIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

export default function VerifyOTPPage() {
    // ─── Navigation ───────────────────────────────────────────────────────────
    const router = useRouter(); // Redirect after OTP verification

    // ─── Component State ──────────────────────────────────────────────────────
    const [email, setEmail] = useState('abc@gmail.com');  // User's email (from URL params)
    const [flow, setFlow] = useState<'onboarding' | 'signin'>('onboarding'); // Determines post-verify redirect
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP, one digit per array element
    const [error, setError] = useState('');               // Error message from backend
    const [isLoading, setIsLoading] = useState(false);    // Submit button loading state
    const [isResending, setIsResending] = useState(false); // Resend OTP loading state
    const [resendTimer, setResendTimer] = useState(0);    // Countdown timer (seconds) before resend is allowed

    // Refs for the 6 OTP input boxes (used for auto-focus navigation)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // ─── Effects ────────────────────────────────────────────────────────────

    // Parse email and flow type from URL query params on page load
    // URL format: /verify-otp?email=user@example.com&flow=onboarding
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');
            const flowParam = urlParams.get('flow');
            if (emailParam) setEmail(emailParam);
            if (flowParam === 'onboarding') setFlow('onboarding');
            else setFlow('signin');
        }
    }, []);

    // Countdown timer for resend button cooldown (ticks every second)
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // ─── OTP Input Handlers ───────────────────────────────────────────────────

    // Handle typing a digit — only allows numbers, auto-focuses next input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace key — navigates focus to previous input
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste — distributes pasted digits across all 6 input boxes
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    /**
     * BACKEND INTEGRATION: Resend OTP (Rate Limited)
     * 
     * Calls POST /onboarding/resend-otp on the NestJS backend.
     * The backend rate-limits resend requests (max 3 within 5 minutes).
     * A 60-second cooldown timer prevents rapid clicking on the frontend.
     * 
     * API: POST /api/backend/onboarding/resend-otp
     * Body: { email }
     */
    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        setError('');
        try {
            await onboardingApi.resendOtp(email);
            setResendTimer(60);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to resend OTP.');
            }
        } finally {
            setIsResending(false);
        }
    };

    /**
     * BACKEND INTEGRATION: OTP Verification (Step 2 of 3)
     * 
     * Calls POST /onboarding/verify-otp on the NestJS backend.
     * The backend checks the 6-digit OTP against the value stored in Redis.
     * 
     * If flow === 'onboarding':
     *   - Also calls POST /onboarding/complete (Step 3) to create the user account
     *   - Uses form data stored in sessionStorage from the signup page
     *   - Assigns the MANAGER role to the new user
     *   - Then redirects to /onboarding/basic-details
     * 
     * If flow === 'signin':
     *   - Just verifies and redirects to /dashboard
     * 
     * API: POST /api/backend/onboarding/verify-otp
     * Body: { email, code }
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);

        try {
            // BACKEND: Verify OTP against Redis-stored value
            await onboardingApi.verifyOtp(email, otpCode);

            if (flow === 'onboarding') {
                // BACKEND: Complete onboarding — create user account with MANAGER role
                const stored = sessionStorage.getItem('tavlo_onboarding');
                if (stored) {
                    const data = JSON.parse(stored);
                    await onboardingApi.complete({
                        email: data.email,
                        password: data.password,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        restaurantName: data.restaurantName || 'My Restaurant',
                    });
                    sessionStorage.removeItem('tavlo_onboarding');
                }
                router.push('/onboarding/basic-details');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Helpers ────────────────────────────────────────────────────────────

    // Mask email for display: "abc***@gmail.com" for privacy
    const maskEmail = (emailStr: string) => {
        const [localPart, domain] = emailStr.split('@');
        if (!domain || localPart.length <= 3) return emailStr;
        return `${localPart.slice(0, 3)}***@${domain}`;
    };

    // Security badges shown in the right panel sidebar
    const securityFeatures = [
        { icon: <ShieldIcon />, text: 'Bank-grade encryption' },
        { icon: <LockIcon />, text: 'Two-factor authentication' },
        { icon: <CheckIcon />, text: 'Verified secure connection' },
    ];

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>

                {/* ── Left Section: OTP Verification Form ───────────────── */}
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

                        <div className={styles.headerSection}>
                            <div className={styles.mailIconWrapper}>
                                <MailIcon />
                            </div>
                            <h1 className={styles.title}>Verify your email</h1>
                            <p className={styles.subtitle}>
                                We&apos;ve sent a 6-digit verification code to
                            </p>
                            <div className={styles.emailDisplay}>
                                <span className={styles.emailText}>{maskEmail(email)}</span>
                                <Link href="/signin" className={styles.editEmail}>
                                    Change
                                </Link>
                            </div>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* OTP Input Boxes */}
                            <div className={styles.otpContainer} onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`${styles.otpInput} ${digit ? styles.filled : ''}`}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Resend Code */}
                            <div className={styles.resendSection}>
                                <span className={styles.resendText}>Didn&apos;t receive the code?</span>
                                {resendTimer > 0 ? (
                                    <span className={styles.resendTimer}>Resend in {resendTimer}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.resendLink}
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                    >
                                        {isResending ? 'Sending...' : 'Resend code'}
                                    </button>
                                )}
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                Verify & Continue
                            </button>
                        </form>

                        <p className={styles.switchText}>
                            <Link href="/signin" className={styles.switchLink}>
                                ← Back to Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Section - Security Showcase */}
                <div className={styles.showcaseSection}>
                    <div className={styles.showcaseContent}>
                        <div className={styles.securityHeader}>
                            <div className={styles.securityIconBig}>
                                <ShieldIcon />
                            </div>
                            <h2 className={styles.securityTitle}>Your security matters</h2>
                            <p className={styles.securitySubtitle}>
                                This extra step helps keep your account safe from unauthorized access
                            </p>
                        </div>

                        <div className={styles.securityFeatures}>
                            {securityFeatures.map((feature, index) => (
                                <div key={index} className={styles.securityFeature}>
                                    <span className={styles.securityFeatureIcon}>
                                        {feature.icon}
                                    </span>
                                    <span className={styles.securityFeatureText}>
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.helpSection}>
                            <p className={styles.helpText}>
                                Having trouble? <a href="mailto:support@tavlo.in">Contact Support</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

/**
 * Tavlo Restaurant - Customer Login Page
 * 
 * Mobile-first login with phone number and OTP verification.
 * Customers access the menu/ordering dashboard after verification.
 * 
 * @component CustomerLoginPage
 * @route /customer-login
 */

// ─── Dependencies ───────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js client-side navigation
import Image from 'next/image';
import styles from './page.module.css'; // CSS Modules for scoped styling

// BACKEND INTEGRATION: API client for customer OTP-based authentication
import { onboardingApi, authApi, ApiError } from '@/lib/api-client';

export default function CustomerLoginPage() {
    // ─── Navigation ───────────────────────────────────────────────────────────
    const router = useRouter(); // Redirect to menu after successful verification

    // ─── Component State ──────────────────────────────────────────────────────
    const [phone, setPhone] = useState('');                   // 10-digit phone number input
    const [step, setStep] = useState<'phone' | 'otp'>('phone'); // Current UI step: phone entry or OTP entry
    const [otp, setOtp] = useState(['', '', '', '']);         // 4-digit OTP, one digit per array element
    const [isLoading, setIsLoading] = useState(false);       // Loading state for buttons
    const [error, setError] = useState('');                   // Error message from backend
    const [countdown, setCountdown] = useState(0);           // Resend cooldown timer (seconds)

    // Refs for the 4 OTP input boxes (used for auto-focus navigation)
    const otpRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // ─── Effects ────────────────────────────────────────────────────────────

    // Countdown timer for resend OTP cooldown (ticks every second)
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-submit OTP when all 4 digits are entered (no need to press submit)
    useEffect(() => {
        if (otp.every(digit => digit !== '') && step === 'otp') {
            handleVerifyOtp();
        }
    }, [otp]);

    // ─── Input Handlers ─────────────────────────────────────────────────────

    // Phone number input — strips non-digits and limits to 10 characters
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPhone(value);
        setError('');
    };

    /**
     * BACKEND INTEGRATION: Send OTP to Customer Phone
     * 
     * Calls POST /onboarding/register with a generated email format:
     * {phone}@customer.tavlo.in (e.g., 9876543210@customer.tavlo.in)
     * 
     * This reuses the onboarding flow for customers. The backend creates
     * an onboarding request and sends an OTP to the generated email.
     * 
     * API: POST /api/backend/onboarding/register
     * Body: { email: "{phone}@customer.tavlo.in", phone: "+91{phone}" }
     */
    const handleSendOtp = async () => {
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // BACKEND: Use phone-based email format for customer OTP flow
            await onboardingApi.register(`${phone}@customer.tavlo.in`, `+91${phone}`);
            setStep('otp');
            setCountdown(30);
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle typing a digit in OTP box — supports paste and auto-focus
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 4).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 4) newOtp[index + i] = digit;
            });
            setOtp(newOtp);
            const lastIndex = Math.min(index + digits.length, 3);
            otpRefs[lastIndex].current?.focus();
            return;
        }

        const digit = value.replace(/\D/g, '');
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto-focus next input
        if (digit && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    // Handle backspace key in OTP box — navigates focus to previous input
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    /**
     * BACKEND INTEGRATION: Verify Customer OTP
     * 
     * Calls POST /onboarding/verify-otp with the generated customer email.
     * The 4-digit OTP is zero-padded to 6 digits to match backend format.
     * On success, redirects to the menu page.
     * 
     * API: POST /api/backend/onboarding/verify-otp
     * Body: { email: "{phone}@customer.tavlo.in", code: "00XXXX" }
     */
    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter the complete OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // BACKEND: Verify OTP using generated customer email
            const customerEmail = `${phone}@customer.tavlo.in`;
            await onboardingApi.verifyOtp(customerEmail, otpString.padStart(6, '0'));
            // Redirect to menu on success
            router.push('/menu/01');
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

    /**
     * BACKEND INTEGRATION: Resend Customer OTP
     * 
     * Calls POST /onboarding/resend-otp. Rate limited by the backend.
     * 
     * API: POST /api/backend/onboarding/resend-otp
     * Body: { email: "{phone}@customer.tavlo.in" }
     */
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            // BACKEND: Resend OTP using customer email format
            const customerEmail = `${phone}@customer.tavlo.in`;
            await onboardingApi.resendOtp(customerEmail);
            setOtp(['', '', '', '']);
            setCountdown(30);
            otpRefs[0].current?.focus();
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            }
        }
    };

    // Navigate back to phone number entry step, reset OTP state
    const handleBack = () => {
        setStep('phone');
        setOtp(['', '', '', '']);
        setError('');
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className={styles.page}>
            {/* Background decorative elements */}
            <div className={styles.bgPattern} />
            <div className={styles.bgGradient} />

            <div className={styles.container}>

                {/* Back button — shown only during OTP step to go back to phone entry */}
                {step === 'otp' && (
                    <button className={styles.backBtn} onClick={handleBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Card */}
                <div className={styles.card}>
                    {/* Logo */}
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/images/tavlo-logo.png"
                            alt="Tavlo"
                            width={100}
                            height={36}
                            className={styles.logo}
                        />
                    </div>

                    {/* Icon */}
                    <div className={styles.iconCircle}>
                        {step === 'phone' ? (
                            <span className={styles.phoneIcon}>📱</span>
                        ) : (
                            <span className={styles.otpIcon}>🔐</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className={styles.title}>
                        {step === 'phone' ? 'Enter Mobile Number' : 'Verify OTP'}
                    </h1>
                    <p className={styles.subtitle}>
                        {step === 'phone'
                            ? 'We\'ll send you an OTP to verify your number'
                            : `Enter the 4-digit code sent to +91 ${phone}`
                        }
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Phone Input Step */}
                    {step === 'phone' && (
                        <div className={styles.phoneStep}>
                            <div className={styles.phoneInput}>
                                <div className={styles.countryCode}>
                                    <span className={styles.flag}>🇮🇳</span>
                                    <span>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className={styles.input}
                                    autoFocus
                                />
                            </div>

                            <button
                                className={styles.primaryBtn}
                                onClick={handleSendOtp}
                                disabled={isLoading || phone.length !== 10}
                            >
                                {isLoading ? (
                                    <span className={styles.spinner} />
                                ) : (
                                    <>
                                        Get OTP
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* OTP Input Step */}
                    {step === 'otp' && (
                        <div className={styles.otpStep}>
                            <div className={styles.otpInputs}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={otpRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={`${styles.otpBox} ${digit ? styles.filled : ''}`}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <button
                                className={styles.primaryBtn}
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otp.some(d => !d)}
                            >
                                {isLoading ? (
                                    <span className={styles.spinner} />
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>

                            <div className={styles.resendSection}>
                                {countdown > 0 ? (
                                    <p className={styles.resendTimer}>
                                        Resend OTP in <span>{countdown}s</span>
                                    </p>
                                ) : (
                                    <button className={styles.resendBtn} onClick={handleResendOtp}>
                                        Didn't receive? <span>Resend OTP</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className={styles.divider}>
                        <span>or</span>
                    </div>

                    {/* Alternative Actions */}
                    <a href="/select-role" className={styles.altLink}>
                        ← Back to role selection
                    </a>
                </div>

                {/* Footer */}
                <p className={styles.footer}>
                    Staff member?{' '}
                    <a href="/signin" className={styles.footerLink}>Sign in here</a>
                </p>
            </div>
        </div>
    );
}

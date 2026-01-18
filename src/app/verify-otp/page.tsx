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

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Icons
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
    const [email, setEmail] = useState('abc@gmail.com');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Get email from URL on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }
        }
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Handle OTP input change
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

    // Handle backspace navigation
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
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

    // Handle resend code
    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsResending(false);
        setResendTimer(60);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        if (otpCode === '123456') {
            window.location.href = '/onboarding/basic-details';
        } else {
            setError('Invalid verification code. Please try again.');
        }
    };

    // Mask email for display
    const maskEmail = (emailStr: string) => {
        const [localPart, domain] = emailStr.split('@');
        if (!domain || localPart.length <= 3) return emailStr;
        return `${localPart.slice(0, 3)}***@${domain}`;
    };

    const securityFeatures = [
        { icon: <ShieldIcon />, text: 'Bank-grade encryption' },
        { icon: <LockIcon />, text: 'Two-factor authentication' },
        { icon: <CheckIcon />, text: 'Verified secure connection' },
    ];

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                {/* Left Section - Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContent}>
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

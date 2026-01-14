'use client';

/**
 * Tavlo Restaurant ERP - OTP Verification Page
 * 
 * Email verification page with:
 * - Split layout (form + carousel)
 * - 6-digit OTP input boxes
 * - Resend code functionality
 * - Responsive design
 * 
 * @component VerifyOTPPage
 * @route /verify-otp
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const slides = [
    {
        img: '/loginimage.svg',
        text: 'Track Sales and Performance in Real-Time using Tavlo.',
    },
    {
        img: '/logoimage2.svg',
        text: 'Get powerful analytics and insights to grow your business faster.',
    },
    {
        img: '/logoimage3.svg',
        text: 'Collaborate with your team and manage everything from one dashboard.',
    },
];

export default function VerifyOTPPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'abc@gmail.com';

    const [current, setCurrent] = useState(1);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Clone first and last slides for infinite loop effect
    const extendedSlides = [
        slides[slides.length - 1],
        ...slides,
        slides[0],
    ];

    // Carousel auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (current === extendedSlides.length - 1) {
            setTimeout(() => {
                setTransitionEnabled(false);
                setCurrent(1);
            }, 900);
        } else if (current === 0) {
            setTimeout(() => {
                setTransitionEnabled(false);
                setCurrent(extendedSlides.length - 2);
            }, 900);
        } else {
            setTransitionEnabled(true);
        }
    }, [current, extendedSlides.length]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Handle OTP input change
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only last character
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
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

        // Focus last filled input or the next empty one
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setIsResending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsResending(false);
        setResendTimer(60); // 60 second cooldown
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

        // For demo: accept any 6-digit code
        // In production, this would validate against backend
        if (otpCode === '123456') {
            window.location.href = '/dashboard';
        } else {
            setError('Invalid verification code. Please try again.');
        }
    };

    // Mask email for display
    const maskEmail = (email: string) => {
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 3) return email;
        return `${localPart.slice(0, 3)}***@${domain}`;
    };

    return (
        <div className={styles.authPage}>
            {/* Left Section - Form */}
            <div className={styles.formSection}>
                <div className={styles.logoWrapper}>
                    <Image
                        src="/images/tavlo-logo.png"
                        alt="Tavlo"
                        width={140}
                        height={50}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.formContainer}>
                    <h1 className={styles.title}>We emailed you a code</h1>
                    <p className={styles.subtitle}>Verify it&apos;s you</p>

                    <p className={styles.emailInfo}>
                        Enter the verification code sent to:
                    </p>
                    <div className={styles.emailDisplay}>
                        <span>{maskEmail(email)}</span>
                        <Link href="/signin" className={styles.editEmail}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </Link>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
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
                                    className={styles.otpInput}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {/* Resend Code */}
                        <div className={styles.resendSection}>
                            <span className={styles.resendText}>didn&apos;t received code yet?</span>
                            {resendTimer > 0 ? (
                                <span className={styles.resendTimer}>Resend in {resendTimer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.resendLink}
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                >
                                    {isResending ? 'Sending...' : 'Resend Code'}
                                </button>
                            )}
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Continue
                        </button>
                    </form>

                    <p className={styles.switchText}>
                        <Link href="/signin" className={styles.switchLink}>
                            ← Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Carousel */}
            <div className={styles.carouselSection}>
                <div className={styles.carouselBg}></div>
                <div className={styles.carouselContent}>
                    <div
                        className={`${styles.carouselTrack} ${transitionEnabled ? styles.animated : ''}`}
                        style={{
                            transform: `translateX(-${current * 100}%)`,
                            width: `${extendedSlides.length * 100}%`,
                        }}
                    >
                        {extendedSlides.map((slide, i) => (
                            <div key={i} className={styles.slide}>
                                <Image
                                    src={slide.img}
                                    alt={`Slide ${i}`}
                                    width={400}
                                    height={400}
                                    className={styles.slideImage}
                                />
                                <p className={styles.slideText}>{slide.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div className={styles.dots}>
                        {slides.map((_, i) => (
                            <span
                                key={i}
                                className={`${styles.dot} ${i === ((current - 1 + slides.length) % slides.length) ? styles.activeDot : ''
                                    }`}
                            ></span>
                        ))}
                    </div>

                    {/* Trusted Partners */}
                    <div className={styles.trustedSection}>
                        <span className={styles.trustedLine}></span>
                        <span className={styles.trustedText}>Trusted Partners</span>
                        <span className={styles.trustedLine}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

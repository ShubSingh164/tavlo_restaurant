'use client';

/**
 * Tavlo Restaurant ERP - Sign In Page
 * 
 * Authentication page with:
 * - Split layout (form + carousel)
 * - Google OAuth option
 * - Email/password login
 * - Responsive design
 * 
 * @component SignInPage
 * @route /signin
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function SignInPage() {
  const [current, setCurrent] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Clone first and last slides for infinite loop effect
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded login credentials
    const validEmail = 'tavlo123@gmail.com';
    const validPassword = '@123456';

    if (email === validEmail && password === validPassword) {
      // Successful login - redirect to OTP verification
      window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
    } else {
      setError('Invalid email or password. Please try again.');
    }
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
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue to your dashboard</p>

          <button className={styles.googleBtn}>
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR SIGN IN WITH</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="abc@gmail.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </form>

          <p className={styles.switchText}>
            New to Tavlo?{' '}
            <Link href="/signup" className={styles.switchLink}>
              Sign up
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

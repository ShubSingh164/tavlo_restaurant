'use client';

/**
 * Tavlo Restaurant ERP - Sign In Page
 * 
 * Modern authentication page with:
 * - Card-based layout matching onboarding theme
 * - Feature showcase on the right
 * - Google OAuth option
 * - Email/password login with icons
 * 
 * @component SignInPage
 * @route /signin
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Icons
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

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hardcoded login credentials
    const validEmail = 'tavlo123@gmail.com';
    const validPassword = '@123456';

    if (email === validEmail && password === validPassword) {
      window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

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
              <h1 className={styles.title}>Sign in to Tavlo</h1>
              <p className={styles.subtitle}>
                Enter your credentials to access your restaurant dashboard
              </p>
            </div>

            <button className={styles.googleBtn}>
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerLine}></span>
              <span className={styles.dividerText}>OR</span>
              <span className={styles.dividerLine}></span>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div className={styles.errorMessage}>
                  ⚠️ {error}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><EmailIcon /></span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><LockIcon /></span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Remember me</span>
                </label>
                <div className={styles.forgotPassword}>
                  <Link href="/forgot-password">Forgot password?</Link>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Sign In
              </button>
            </form>

            <p className={styles.switchText}>
              New to Tavlo?{' '}
              <Link href="/signup" className={styles.switchLink}>
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Feature Showcase */}
        <div className={styles.showcaseSection}>
          <div className={styles.showcaseContent}>
            <div className={styles.featureCards}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ChartIcon />
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Real-time Analytics</h3>
                  <p className={styles.featureDesc}>Track sales, orders, and performance metrics instantly</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <UsersIcon />
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Staff Management</h3>
                  <p className={styles.featureDesc}>Manage schedules, roles, and team coordination</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ClipboardIcon />
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Order Processing</h3>
                  <p className={styles.featureDesc}>Streamline orders from dine-in to delivery</p>
                </div>
              </div>
            </div>

            <div className={styles.quoteSection}>
              <p className={styles.quoteText}>
                "Tavlo transformed how we run our restaurant. Everything in one place!"
              </p>
              <p className={styles.quoteAuthor}>
                — <strong>Rahul Sharma</strong>, Owner of Spice Garden
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

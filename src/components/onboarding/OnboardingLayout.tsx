'use client';

/**
 * Tavlo Restaurant ERP - Onboarding Layout Component
 * Shared layout for all 6 onboarding steps
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './onboarding.module.css';

// Step configuration
const steps = [
    { id: 1, label: 'Restaurant Basic Details', path: '/onboarding/basic-details' },
    { id: 2, label: 'Location and contact Details', path: '/onboarding/location' },
    { id: 3, label: 'legal and business Information', path: '/onboarding/legal' },
    { id: 4, label: 'Restaurant Operations Setup', path: '/onboarding/operations' },
    { id: 5, label: 'Payment Setup', path: '/onboarding/payment' },
    { id: 6, label: 'Review & Go Live', path: '/onboarding/review' },
];

interface OnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    title: string;
    subtitle?: string;
}

export default function OnboardingLayout({
    children,
    currentStep,
    title,
    subtitle,
}: OnboardingLayoutProps) {
    const pathname = usePathname();

    const getStepStatus = (stepId: number) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'active';
        return 'pending';
    };

    return (
        <div className={styles.onboardingPage}>
            <div className={styles.onboardingCard}>
                {/* Left Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarLogo}>
                        <Image
                            src="/images/tavlo-logo.png"
                            alt="Tavlo"
                            width={120}
                            height={40}
                            priority
                        />
                    </div>

                    <nav>
                        <ul className={styles.stepList}>
                            {steps.map((step) => {
                                const status = getStepStatus(step.id);
                                return (
                                    <li key={step.id}>
                                        <Link
                                            href={step.path}
                                            className={`${styles.stepItem} ${status === 'active' ? styles.active : ''} ${status === 'completed' ? styles.completed : ''}`}
                                        >
                                            <span className={`${styles.stepIndicator} ${styles[status]}`}>
                                                {status === 'completed' ? '✓' : step.id}
                                            </span>
                                            <span className={styles.stepLabel}>{step.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <header className={styles.formHeader}>
                        <h1 className={styles.formTitle}>{title}</h1>
                        {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
                    </header>

                    {children}
                </main>
            </div>
        </div>
    );
}

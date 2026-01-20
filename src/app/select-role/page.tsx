'use client';

/**
 * Tavlo Restaurant ERP - Role Selection Page
 * 
 * Beautiful role selection after signup with animated cards.
 * Routes users to appropriate auth flows based on role.
 * 
 * @component SelectRolePage
 * @route /select-role
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

interface Role {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    route: string;
}

const roles: Role[] = [
    {
        id: 'customer',
        title: 'Customer',
        description: 'Browse menu, place orders & track your food in real-time',
        icon: '🍽️',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        route: '/customer-login',
    },
    {
        id: 'chef',
        title: 'Chef',
        description: 'Manage kitchen orders, track prep time & update status',
        icon: '👨‍🍳',
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        route: '/signin',
    },
    {
        id: 'waiter',
        title: 'Waiter',
        description: 'Handle table service, take orders & assist customers',
        icon: '🤵',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        route: '/signin',
    },
    {
        id: 'admin',
        title: 'Admin',
        description: 'Full dashboard access, analytics & team management',
        icon: '👑',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        route: '/signin',
    },
];

export default function SelectRolePage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role.id);
        setIsNavigating(true);

        // Animate out then navigate
        setTimeout(() => {
            router.push(role.route);
        }, 400);
    };

    return (
        <div className={styles.page}>
            {/* Background Decorations */}
            <div className={styles.bgBlob1} />
            <div className={styles.bgBlob2} />
            <div className={styles.bgBlob3} />
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/images/tavlo-logo.png"
                            alt="Tavlo"
                            width={120}
                            height={44}
                            className={styles.logo}
                        />
                    </div>
                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>✨</span>
                        <span>Welcome to Tavlo</span>
                    </div>
                    <h1 className={styles.title}>How will you be using Tavlo?</h1>
                    <p className={styles.subtitle}>
                        Select your role to get started with the best experience
                    </p>
                </div>

                {/* Role Cards Grid */}
                <div className={`${styles.cardsGrid} ${isNavigating ? styles.navigating : ''}`}>
                    {roles.map((role, index) => (
                        <button
                            key={role.id}
                            className={`${styles.roleCard} ${selectedRole === role.id ? styles.selected : ''}`}
                            onClick={() => handleRoleSelect(role)}
                            style={{
                                '--role-color': role.color,
                                '--role-gradient': role.gradient,
                                '--card-delay': `${index * 0.1}s`,
                            } as React.CSSProperties}
                        >
                            <div className={styles.cardGlow} />
                            <div className={styles.cardContent}>
                                <div className={styles.iconWrapper}>
                                    <span className={styles.icon}>{role.icon}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{role.title}</h3>
                                <p className={styles.cardDesc}>{role.description}</p>
                                <div className={styles.cardArrow}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className={styles.cardBorder} />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <p className={styles.footerText}>
                    Already have an account?{' '}
                    <a href="/signin" className={styles.footerLink}>Sign in</a>
                </p>
            </div>
        </div>
    );
}

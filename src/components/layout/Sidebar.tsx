'use client';

/**
 * Tavlo Restaurant ERP - Admin Sidebar Component
 * 
 * Main navigation sidebar for the admin dashboard.
 * Based on the Tavlo design reference with grouped navigation items.
 * 
 * @component AdminSidebar
 * @backend Uses restaurant data from context/API
 * @api GET /api/restaurants/:id - Fetch current restaurant info
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

// Navigation item type
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

// Navigation group type
interface NavGroup {
    title: string;
    items: NavItem[];
}

// Icon components (simplified SVG icons)
const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const OrdersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
    </svg>
);

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
);

const StaffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const CustomersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ReviewsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const AnalyticsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
);

const BillingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
    </svg>
);

const TaxIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
    </svg>
);

const RevenueIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const HelpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
    </svg>
);

const DeliveryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const MessagingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);

const CollapseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
    </svg>
);

// Navigation configuration
const navigationGroups: NavGroup[] = [
    {
        title: 'HOME',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
        ],
    },
    {
        title: 'GENERAL',
        items: [
            { label: 'Orders', href: '/orders', icon: <OrdersIcon /> },
            { label: 'Menu', href: '/menu', icon: <MenuIcon /> },
            { label: 'Staff', href: '/staff', icon: <StaffIcon /> },
        ],
    },
    {
        title: 'LEADS',
        items: [
            { label: 'Customers', href: '/customers', icon: <CustomersIcon /> },
            { label: 'Reviews', href: '/reviews', icon: <ReviewsIcon /> },
            { label: 'Analytics', href: '/analytics', icon: <AnalyticsIcon /> },
        ],
    },
    {
        title: 'FINANCE',
        items: [
            { label: 'Billing & Payments', href: '/billing', icon: <BillingIcon /> },
            { label: 'Taxation & Accounting', href: '/taxation', icon: <TaxIcon /> },
            { label: 'Revenue Report', href: '/revenue', icon: <RevenueIcon /> },
        ],
    },
    {
        title: 'SUPPORT',
        items: [
            { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
            { label: 'Help and Support', href: '/help', icon: <HelpIcon /> },
        ],
    },
    {
        title: 'INTEGRATION',
        items: [
            { label: 'Delivery App', href: '/delivery', icon: <DeliveryIcon /> },
            { label: 'Messaging', href: '/messaging', icon: <MessagingIcon /> },
        ],
    },
];

/**
 * AdminSidebar component
 * Renders the main navigation sidebar with grouped menu items
 */

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    /**
     * @backend Replace with actual restaurant data from context/API
     * @api GET /api/restaurants/current
     */
    const restaurant = {
        name: 'Haldiram',
        type: 'Admin Store',
        logo: null, // Replace with actual logo URL
    };

    const isActive = (href: string) => pathname === href;

    const handleNavClick = () => {
        // Close mobile sidebar when navigating
        if (onClose) {
            onClose();
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isOpen ? styles.open : ''}`}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <Link href="/dashboard" className={styles.logo}>
                    <img
                        src="/images/tavlo-logo.png"
                        alt="Tavlo"
                        className={styles.logoImage}
                    />
                </Link>
                <button
                    className={styles.collapseBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <CollapseIcon />
                </button>
            </div>

            {/* Restaurant Selector */}
            <div className={styles.restaurantSelector}>
                <div className={styles.restaurantLogo}>
                    {restaurant.logo ? (
                        <img src={restaurant.logo} alt={restaurant.name} />
                    ) : (
                        <div className={styles.restaurantLogoPlaceholder}>
                            {restaurant.name.charAt(0)}
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <div className={styles.restaurantInfo}>
                        <span className={styles.restaurantName}>{restaurant.name}</span>
                        <span className={styles.restaurantType}>{restaurant.type}</span>
                    </div>
                )}
                {!isCollapsed && (
                    <button className={styles.restaurantSwitch} aria-label="Switch restaurant">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation Groups */}
            <nav className={styles.nav}>
                {navigationGroups.map((group) => (
                    <div key={group.title} className={styles.navGroup}>
                        {!isCollapsed && (
                            <span className={styles.navGroupTitle}>{group.title}</span>
                        )}
                        <ul className={styles.navList}>
                            {group.items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                                        title={isCollapsed ? item.label : undefined}
                                        onClick={handleNavClick}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        {!isCollapsed && (
                                            <span className={styles.navLabel}>{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Upgrade CTA */}
            {!isCollapsed && (
                <div className={styles.upgradeCta}>
                    <button className={styles.upgradeBtn}>
                        UPGRADE TO PRO
                    </button>
                </div>
            )}
        </aside>
    );
}

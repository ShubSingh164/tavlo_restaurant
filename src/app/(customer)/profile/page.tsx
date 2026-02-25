'use client';

/**
 * Tavlo - Customer Profile & Loyalty Page
 * 
 * Engagement hub showing:
 * - Glassmorphic profile header with loyalty badge
 * - Quick stats cards
 * - Order history with reorder
 * - Loyalty progress bar
 * - Saved payments (mocked)
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

// Types
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    restaurant: string;
    items: OrderItem[];
    total: number;
    status: 'delivered' | 'cancelled';
    rating?: number;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    loyaltyLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    points: number;
    pointsToNextLevel: number;
    totalOrders: number;
    favCuisine: string;
    joinedDate: string;
    savedPayments: { id: string; type: 'upi' | 'card'; last4: string; label: string }[];
    orders: Order[];
}

// Icons
const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const BagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const GiftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
);

const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
);

const CardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const UpiIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M8 10l4-4 4 4" />
        <path d="M8 14l4 4 4-4" />
    </svg>
);

// Mock user data
const mockUser: UserProfile = {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    loyaltyLevel: 'Gold',
    points: 2450,
    pointsToNextLevel: 550,
    totalOrders: 47,
    favCuisine: 'North Indian',
    joinedDate: 'Jan 2024',
    savedPayments: [
        { id: 'upi-1', type: 'upi', last4: '1234', label: 'rahul@upi' },
        { id: 'card-1', type: 'card', last4: '4242', label: 'HDFC Credit Card' },
    ],
    orders: [
        {
            id: 'ORD-2024-001',
            date: '2024-01-18',
            restaurant: 'Tandoori Nights',
            items: [
                { name: 'Butter Chicken', quantity: 1, price: 349 },
                { name: 'Butter Naan', quantity: 2, price: 90 },
            ],
            total: 489,
            status: 'delivered',
            rating: 5,
        },
        {
            id: 'ORD-2024-002',
            date: '2024-01-15',
            restaurant: 'Spice Garden',
            items: [
                { name: 'Paneer Tikka', quantity: 1, price: 279 },
                { name: 'Dal Makhani', quantity: 1, price: 199 },
            ],
            total: 528,
            status: 'delivered',
            rating: 4,
        },
        {
            id: 'ORD-2024-003',
            date: '2024-01-10',
            restaurant: 'Tandoori Nights',
            items: [
                { name: 'Chicken Biryani', quantity: 2, price: 598 },
            ],
            total: 648,
            status: 'delivered',
        },
    ],
};

// Loyalty level config
const loyaltyConfig = {
    Bronze: { color: '#cd7f32', nextLevel: 'Silver', threshold: 1000 },
    Silver: { color: '#9ca3af', nextLevel: 'Gold', threshold: 2000 },
    Gold: { color: '#fbbf24', nextLevel: 'Platinum', threshold: 3000 },
    Platinum: { color: '#a855f7', nextLevel: null, threshold: null },
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');

    // Fetch user data
    useEffect(() => {
        setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
        }, 500);
    }, []);

    // Calculate progress to next level
    const getProgressPercentage = () => {
        if (!user) return 0;
        const config = loyaltyConfig[user.loyaltyLevel];
        if (!config.threshold) return 100;
        const previousThreshold = user.loyaltyLevel === 'Bronze' ? 0 :
            loyaltyConfig[Object.keys(loyaltyConfig)[Object.keys(loyaltyConfig).indexOf(user.loyaltyLevel) - 1] as keyof typeof loyaltyConfig].threshold || 0;
        const progress = ((user.points - previousThreshold) / ((config.threshold || 3000) - previousThreshold)) * 100;
        return Math.min(100, Math.max(0, progress));
    };

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (isLoading || !user) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading profile...</p>
            </div>
        );
    }

    const loyaltyLevelConfig = loyaltyConfig[user.loyaltyLevel];

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <BackIcon />
                </button>
                <h1>My Profile</h1>
                <button className={styles.settingsBtn}>
                    <SettingsIcon />
                </button>
            </header>

            {/* Profile Card - Glassmorphic */}
            <div className={styles.profileCard}>
                <div className={styles.profileBg} style={{ background: `linear-gradient(135deg, ${loyaltyLevelConfig.color}22 0%, ${loyaltyLevelConfig.color}44 100%)` }} />

                <div className={styles.profileContent}>
                    <div className={styles.avatarWrapper}>
                        <img src={user.avatar} alt={user.name} className={styles.avatar} />
                        <div
                            className={styles.loyaltyBadge}
                            style={{ background: loyaltyLevelConfig.color }}
                        >
                            {user.loyaltyLevel}
                        </div>
                    </div>

                    <h2 className={styles.userName}>{user.name}</h2>
                    <p className={styles.userEmail}>{user.email}</p>

                    {/* Loyalty Progress */}
                    <div className={styles.loyaltyProgress}>
                        <div className={styles.progressInfo}>
                            <span>{user.points} points</span>
                            {loyaltyLevelConfig.nextLevel && (
                                <span>{user.pointsToNextLevel} to {loyaltyLevelConfig.nextLevel}</span>
                            )}
                        </div>
                        <div className={styles.progressBar}>
                            <motion.div
                                className={styles.progressFill}
                                style={{ background: loyaltyLevelConfig.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgressPercentage()}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
                <motion.div
                    className={styles.statCard}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#f97316' }}>
                        <BagIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{user.totalOrders}</span>
                        <span className={styles.statLabel}>Total Orders</span>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.statCard}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#22c55e' }}>
                        <GiftIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{user.points}</span>
                        <span className={styles.statLabel}>Points Earned</span>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.statCard}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>
                        <HeartIcon />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{user.favCuisine}</span>
                        <span className={styles.statLabel}>Favorite Cuisine</span>
                    </div>
                </motion.div>
            </div>

            {/* Content Tabs */}
            <div className={styles.tabsSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Order History
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'payments' ? styles.active : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        Saved Payments
                    </button>
                </div>

                {/* Order History */}
                {activeTab === 'orders' && (
                    <div className={styles.ordersList}>
                        {user.orders.map((order) => (
                            <motion.div
                                key={order.id}
                                className={styles.orderCard}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className={styles.orderHeader}>
                                    <div>
                                        <h4>{order.restaurant}</h4>
                                        <span className={styles.orderDate}>{formatDate(order.date)}</span>
                                    </div>
                                    <span className={styles.orderId}>{order.id}</span>
                                </div>

                                <div className={styles.orderItems}>
                                    {order.items.map((item, i) => (
                                        <span key={i}>{item.quantity}x {item.name}</span>
                                    ))}
                                </div>

                                <div className={styles.orderFooter}>
                                    <span className={styles.orderTotal}>₹{order.total}</span>

                                    {order.rating ? (
                                        <div className={styles.orderRating}>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < order.rating!} />
                                            ))}
                                        </div>
                                    ) : (
                                        <button className={styles.rateBtn}>Rate Order</button>
                                    )}

                                    <button className={styles.reorderBtn}>
                                        <RefreshIcon />
                                        Reorder
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Saved Payments */}
                {activeTab === 'payments' && (
                    <div className={styles.paymentsList}>
                        {user.savedPayments.map((payment) => (
                            <div key={payment.id} className={styles.paymentCard}>
                                <div className={styles.paymentIcon}>
                                    {payment.type === 'upi' ? <UpiIcon /> : <CardIcon />}
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span className={styles.paymentLabel}>{payment.label}</span>
                                    <span className={styles.paymentType}>
                                        {payment.type === 'upi' ? 'UPI' : `•••• ${payment.last4}`}
                                    </span>
                                </div>
                                <button className={styles.paymentRemove}>Remove</button>
                            </div>
                        ))}

                        <button className={styles.addPaymentBtn}>
                            + Add New Payment Method
                        </button>
                    </div>
                )}
            </div>

            {/* Free Meal Banner */}
            <div className={styles.rewardBanner}>
                <div className={styles.rewardIcon}>🎁</div>
                <div className={styles.rewardInfo}>
                    <h4>Free Meal Unlocked!</h4>
                    <p>Redeem 500 points for a free starter</p>
                </div>
                <button className={styles.rewardBtn}>Claim</button>
            </div>
        </div>
    );
}

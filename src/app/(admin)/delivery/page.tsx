'use client';

/**
 * Tavlo Restaurant ERP - Delivery App Integration Page
 * 
 * Delivery integrations with:
 * - Platform connections (Swiggy, Zomato, etc.)
 * - Order sync status
 * - Delivery metrics
 * - API configuration
 * 
 * @component DeliveryPage
 * @route /delivery
 */

import React, { useState } from 'react';

import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Mock delivery data
const deliveryPlatforms = [
    {
        id: 'swiggy',
        name: 'Swiggy',
        logo: '🟠',
        connected: true,
        lastSync: '2 min ago',
        ordersToday: 45,
        revenue: 28500,
        status: 'active',
    },
    {
        id: 'zomato',
        name: 'Zomato',
        logo: '🔴',
        connected: true,
        lastSync: '5 min ago',
        ordersToday: 38,
        revenue: 24200,
        status: 'active',
    },
    {
        id: 'uber_eats',
        name: 'Uber Eats',
        logo: '🟢',
        connected: false,
        ordersToday: 0,
        revenue: 0,
        status: 'disconnected',
    },
    {
        id: 'dunzo',
        name: 'Dunzo',
        logo: '🟡',
        connected: true,
        lastSync: '1 hour ago',
        ordersToday: 12,
        revenue: 8600,
        status: 'warning',
    },
];

const recentDeliveryOrders = [
    { id: 'DEL-001', platform: 'Swiggy', customer: 'Rahul S.', items: 3, amount: 850, status: 'delivered', time: '10 min ago' },
    { id: 'DEL-002', platform: 'Zomato', customer: 'Priya P.', items: 2, amount: 520, status: 'out_for_delivery', time: '15 min ago' },
    { id: 'DEL-003', platform: 'Swiggy', customer: 'Amit K.', items: 4, amount: 1200, status: 'preparing', time: '20 min ago' },
    { id: 'DEL-004', platform: 'Dunzo', customer: 'Sneha G.', items: 1, amount: 350, status: 'delivered', time: '25 min ago' },
    { id: 'DEL-005', platform: 'Zomato', customer: 'Vikram S.', items: 5, amount: 1650, status: 'preparing', time: '30 min ago' },
];

// Icons
const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
);

const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
);

// Platform Card
function PlatformCard({ platform }: { platform: typeof deliveryPlatforms[0] }) {
    const getStatusClass = () => {
        switch (platform.status) {
            case 'active': return styles.statusActive;
            case 'warning': return styles.statusWarning;
            case 'disconnected': return styles.statusDisconnected;
            default: return '';
        }
    };

    return (
        <div className={`${styles.platformCard} ${!platform.connected ? styles.disconnected : ''}`}>
            <div className={styles.platformHeader}>
                <span className={styles.platformLogo}>{platform.logo}</span>
                <div className={styles.platformInfo}>
                    <span className={styles.platformName}>{platform.name}</span>
                    <span className={`${styles.platformStatus} ${getStatusClass()}`}>
                        {platform.connected ? (platform.status === 'warning' ? 'Sync Issue' : 'Connected') : 'Disconnected'}
                    </span>
                </div>
                <label className={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked={platform.connected} />
                    <span className={styles.slider}></span>
                </label>
            </div>

            {platform.connected && (
                <>
                    <div className={styles.platformStats}>
                        <div className={styles.platformStat}>
                            <span className={styles.statValue}>{platform.ordersToday}</span>
                            <span className={styles.statLabel}>Orders Today</span>
                        </div>
                        <div className={styles.platformStat}>
                            <span className={styles.statValue}>{formatCurrency(platform.revenue)}</span>
                            <span className={styles.statLabel}>Revenue</span>
                        </div>
                    </div>
                    <div className={styles.platformFooter}>
                        <span className={styles.lastSync}>Last sync: {platform.lastSync}</span>
                        <button className={styles.syncBtn}>
                            <RefreshIcon />
                            Sync Now
                        </button>
                    </div>
                </>
            )}

            {!platform.connected && (
                <div className={styles.connectPrompt}>
                    <p>Connect your {platform.name} account to start receiving orders</p>
                    <button className={styles.connectBtn}>
                        <LinkIcon />
                        Connect
                    </button>
                </div>
            )}
        </div>
    );
}

export default function DeliveryPage() {
    const totalDeliveryOrders = deliveryPlatforms.reduce((sum, p) => sum + p.ordersToday, 0);
    const totalDeliveryRevenue = deliveryPlatforms.reduce((sum, p) => sum + p.revenue, 0);
    const connectedPlatforms = deliveryPlatforms.filter(p => p.connected).length;

    const getOrderStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; color: string; label: string }> = {
            delivered: { bg: '#dcfce7', color: '#16a34a', label: 'Delivered' },
            out_for_delivery: { bg: '#dbeafe', color: '#2563eb', label: 'Out for Delivery' },
            preparing: { bg: '#fef3c7', color: '#d97706', label: 'Preparing' },
        };
        return config[status] || config.preparing;
    };

    return (
        
            <div className={styles.deliveryPage}>
                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" rx="2" />
                                <path d="M16 8h4l3 3v5h-7V8z" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{totalDeliveryOrders}</span>
                            <span className={styles.statLabel}>Delivery Orders Today</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{formatCurrency(totalDeliveryRevenue)}</span>
                            <span className={styles.statLabel}>Delivery Revenue</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{connectedPlatforms}/{deliveryPlatforms.length}</span>
                            <span className={styles.statLabel}>Platforms Connected</span>
                        </div>
                    </div>
                </div>

                {/* Platforms Grid */}
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Delivery Platforms</h2>
                    <button className={styles.addPlatformBtn}>+ Add Platform</button>
                </div>
                <div className={styles.platformsGrid}>
                    {deliveryPlatforms.map(platform => (
                        <PlatformCard key={platform.id} platform={platform} />
                    ))}
                </div>

                {/* Recent Orders */}
                <div className={styles.ordersCard}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Recent Delivery Orders</h2>
                        <button className={styles.viewAllBtn}>View All</button>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Platform</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDeliveryOrders.map(order => {
                                    const status = getOrderStatusBadge(order.status);
                                    return (
                                        <tr key={order.id}>
                                            <td><span className={styles.orderId}>{order.id}</span></td>
                                            <td>{order.platform}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.items} items</td>
                                            <td><span className={styles.amount}>{formatCurrency(order.amount)}</span></td>
                                            <td>
                                                <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td><span className={styles.timeAgo}>{order.time}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        
    );
}

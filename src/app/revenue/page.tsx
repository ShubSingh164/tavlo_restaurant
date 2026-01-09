'use client';

/**
 * Tavlo Restaurant ERP - Revenue Report Page
 * 
 * Revenue analytics with:
 * - Revenue trends and charts
 * - Comparison by period
 * - Revenue by categories
 * - Export reports
 * 
 * @component RevenuePage
 * @route /revenue
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Mock revenue data
const mockRevenueData = {
    thisMonth: 845200,
    lastMonth: 762800,
    thisYear: 9856000,
    growth: 10.8,
};

const monthlyRevenue = [
    { month: 'Jan', revenue: 685000, orders: 1245 },
    { month: 'Feb', revenue: 720000, orders: 1312 },
    { month: 'Mar', revenue: 695000, orders: 1198 },
    { month: 'Apr', revenue: 810000, orders: 1456 },
    { month: 'May', revenue: 875000, orders: 1587 },
    { month: 'Jun', revenue: 920000, orders: 1678 },
    { month: 'Jul', revenue: 845000, orders: 1534 },
    { month: 'Aug', revenue: 890000, orders: 1612 },
    { month: 'Sep', revenue: 965000, orders: 1756 },
    { month: 'Oct', revenue: 1025000, orders: 1867 },
    { month: 'Nov', revenue: 980000, orders: 1789 },
    { month: 'Dec', revenue: 1120000, orders: 2034 },
];

const revenueByCategory = [
    { category: 'Main Course', revenue: 3850000, percentage: 39, color: '#f97316' },
    { category: 'Rice & Biryani', revenue: 2460000, percentage: 25, color: '#3b82f6' },
    { category: 'Starters', revenue: 1480000, percentage: 15, color: '#22c55e' },
    { category: 'Beverages', revenue: 985000, percentage: 10, color: '#8b5cf6' },
    { category: 'Desserts', revenue: 690000, percentage: 7, color: '#ec4899' },
    { category: 'Breads', revenue: 391000, percentage: 4, color: '#f59e0b' },
];

const topPerformingItems = [
    { name: 'Hyderabadi Biryani', revenue: 456000, orders: 1015, growth: 12.5 },
    { name: 'Butter Chicken', revenue: 398000, orders: 1142, growth: 8.2 },
    { name: 'Paneer Tikka', revenue: 312000, orders: 1248, growth: 15.3 },
    { name: 'Dal Makhani', revenue: 245000, orders: 878, growth: 5.8 },
    { name: 'Gulab Jamun', revenue: 198000, orders: 1328, growth: 22.1 },
];

// Icons
const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const TrendUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

export default function RevenuePage() {
    const [period, setPeriod] = useState('year');
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

    return (
        <AdminLayout title="Revenue Report">
            <div className={styles.revenuePage}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Revenue Report</h1>
                        <p className={styles.pageSubtitle}>Track your revenue performance and trends</p>
                    </div>
                    <div className={styles.headerActions}>
                        <select className={styles.periodSelect} value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                        <button className={styles.exportBtn}>
                            <DownloadIcon />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>This Month</span>
                        <span className={styles.statValue}>{formatCurrency(mockRevenueData.thisMonth)}</span>
                        <span className={styles.statChange}>
                            <TrendUpIcon />
                            +{mockRevenueData.growth}% vs last month
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Last Month</span>
                        <span className={styles.statValue}>{formatCurrency(mockRevenueData.lastMonth)}</span>
                        <span className={styles.statMuted}>December 2025</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>This Year</span>
                        <span className={styles.statValue}>{formatCurrency(mockRevenueData.thisYear)}</span>
                        <span className={styles.statMuted}>Jan - Dec 2025</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.highlightCard}`}>
                        <span className={styles.statLabel}>Avg. Monthly</span>
                        <span className={styles.statValue}>{formatCurrency(mockRevenueData.thisYear / 12)}</span>
                        <span className={styles.statMuted}>Based on 12 months</span>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Monthly Revenue Trend</h2>
                    </div>
                    <div className={styles.barChart}>
                        {monthlyRevenue.map((month, i) => (
                            <div key={i} className={styles.barItem}>
                                <div className={styles.barWrapper}>
                                    <div
                                        className={styles.bar}
                                        style={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <div className={styles.barTooltip}>
                                            {formatCurrency(month.revenue)}
                                        </div>
                                    </div>
                                </div>
                                <span className={styles.barLabel}>{month.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Row */}
                <div className={styles.contentRow}>
                    {/* Revenue by Category */}
                    <div className={styles.categoryCard}>
                        <h2 className={styles.cardTitle}>Revenue by Category</h2>
                        <div className={styles.categoryList}>
                            {revenueByCategory.map((cat, i) => (
                                <div key={i} className={styles.categoryItem}>
                                    <div className={styles.categoryInfo}>
                                        <span className={styles.categoryDot} style={{ background: cat.color }} />
                                        <span className={styles.categoryName}>{cat.category}</span>
                                    </div>
                                    <div className={styles.categoryBar}>
                                        <div
                                            className={styles.categoryBarFill}
                                            style={{ width: `${cat.percentage}%`, background: cat.color }}
                                        />
                                    </div>
                                    <div className={styles.categoryStats}>
                                        <span className={styles.categoryRevenue}>{formatCurrency(cat.revenue)}</span>
                                        <span className={styles.categoryPercent}>{cat.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Items */}
                    <div className={styles.topItemsCard}>
                        <h2 className={styles.cardTitle}>Top Performing Items</h2>
                        <div className={styles.itemsList}>
                            {topPerformingItems.map((item, i) => (
                                <div key={i} className={styles.topItem}>
                                    <span className={styles.itemRank}>#{i + 1}</span>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemOrders}>{item.orders} orders</span>
                                    </div>
                                    <div className={styles.itemStats}>
                                        <span className={styles.itemRevenue}>{formatCurrency(item.revenue)}</span>
                                        <span className={styles.itemGrowth}>+{item.growth}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

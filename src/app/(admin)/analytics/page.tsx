'use client';

/**
 * Tavlo Restaurant ERP - Analytics Page
 * 
 * Comprehensive analytics dashboard for restaurant owners:
 * - Revenue trends over time
 * - Order analytics (by hour, day, week)
 * - Popular items performance
 * - Customer analytics
 * - Payment method breakdown
 * - Peak hours analysis
 * - Comparison with previous periods
 * 
 * @component AnalyticsPage
 * @route /analytics
 * @backend Aggregation queries on orders/payments
 * @api GET /api/analytics/revenue - Revenue trends
 * @api GET /api/analytics/orders - Order analytics
 * @api GET /api/analytics/items - Item performance
 * @api GET /api/analytics/customers - Customer metrics
 */

import React, { useState } from 'react';

import { mockDashboardMetrics, mockMenuItems, mockRevenueChartData, mockOrdersChartData } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const TrendUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
    </svg>
);

const TrendDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 18l-9.5-9.5-5 5L1 6" />
        <path d="M17 18h6v-6" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

function MetricCard({ title, value, change, subtitle, icon, color }: MetricCardProps) {
    const isPositive = change >= 0;

    return (
        <div className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ background: color }}>
                {icon}
            </div>
            <div className={styles.metricContent}>
                <span className={styles.metricTitle}>{title}</span>
                <span className={styles.metricValue}>{value}</span>
                <div className={styles.metricFooter}>
                    <span className={`${styles.metricChange} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    <span className={styles.metricSubtitle}>{subtitle}</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// REVENUE CHART
// ============================================================================

function RevenueChart() {
    const [selectedPeriod, setSelectedPeriod] = useState('This Year');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

    const periods = ['This Year', 'Last Year', 'This Quarter', 'Last Quarter', 'This Month'];

    // Data for different periods
    const allData: Record<string, { month: string; revenue: number; orders: number }[]> = {
        'This Year': [
            { month: 'Jan', revenue: 245000, orders: 1200 },
            { month: 'Feb', revenue: 285000, orders: 1350 },
            { month: 'Mar', revenue: 320000, orders: 1500 },
            { month: 'Apr', revenue: 295000, orders: 1420 },
            { month: 'May', revenue: 380000, orders: 1800 },
            { month: 'Jun', revenue: 420000, orders: 2100 },
            { month: 'Jul', revenue: 385000, orders: 1900 },
            { month: 'Aug', revenue: 450000, orders: 2200 },
            { month: 'Sep', revenue: 410000, orders: 2050 },
            { month: 'Oct', revenue: 480000, orders: 2400 },
            { month: 'Nov', revenue: 520000, orders: 2600 },
            { month: 'Dec', revenue: 580000, orders: 2900 },
        ],
        'Last Year': [
            { month: 'Jan', revenue: 195000, orders: 1000 },
            { month: 'Feb', revenue: 225000, orders: 1100 },
            { month: 'Mar', revenue: 260000, orders: 1250 },
            { month: 'Apr', revenue: 240000, orders: 1180 },
            { month: 'May', revenue: 310000, orders: 1500 },
            { month: 'Jun', revenue: 340000, orders: 1700 },
            { month: 'Jul', revenue: 315000, orders: 1550 },
            { month: 'Aug', revenue: 365000, orders: 1800 },
            { month: 'Sep', revenue: 335000, orders: 1650 },
            { month: 'Oct', revenue: 390000, orders: 1950 },
            { month: 'Nov', revenue: 420000, orders: 2100 },
            { month: 'Dec', revenue: 465000, orders: 2300 },
        ],
        'This Quarter': [
            { month: 'Oct', revenue: 480000, orders: 2400 },
            { month: 'Nov', revenue: 520000, orders: 2600 },
            { month: 'Dec', revenue: 580000, orders: 2900 },
        ],
        'Last Quarter': [
            { month: 'Jul', revenue: 385000, orders: 1900 },
            { month: 'Aug', revenue: 450000, orders: 2200 },
            { month: 'Sep', revenue: 410000, orders: 2050 },
        ],
        'This Month': [
            { month: 'Week 1', revenue: 145000, orders: 725 },
            { month: 'Week 2', revenue: 152000, orders: 760 },
            { month: 'Week 3', revenue: 158000, orders: 790 },
            { month: 'Week 4', revenue: 125000, orders: 625 },
        ],
    };

    const monthlyData = allData[selectedPeriod] || allData['This Year'];
    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
    const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
    const avgRevenue = Math.floor(totalRevenue / monthlyData.length);
    const bestMonth = monthlyData.reduce((best, d) => d.revenue > best.revenue ? d : best, monthlyData[0]);

    const handleExport = () => {
        const headers = ['Period', 'Revenue (₹)', 'Orders'];
        const rows = monthlyData.map(d => [d.month, d.revenue.toString(), d.orders.toString()]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-${selectedPeriod.toLowerCase().replace(' ', '-')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePeriodSelect = (period: string) => {
        setSelectedPeriod(period);
        setShowPeriodDropdown(false);
    };

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Revenue Overview</h3>
                    <p className={styles.chartSubtitle}>
                        {selectedPeriod === 'This Month' ? 'Weekly' : 'Monthly'} revenue trends
                    </p>
                </div>
                <div className={styles.chartControls}>
                    <div className={styles.dropdownContainer}>
                        <button
                            className={styles.periodBtn}
                            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                        >
                            <CalendarIcon />
                            {selectedPeriod}
                            <ChevronDownIcon />
                        </button>
                        {showPeriodDropdown && (
                            <div className={styles.dropdownMenu}>
                                {periods.map(period => (
                                    <button
                                        key={period}
                                        className={`${styles.dropdownItem} ${selectedPeriod === period ? styles.active : ''}`}
                                        onClick={() => handlePeriodSelect(period)}
                                    >
                                        {period}
                                        {selectedPeriod === period && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className={styles.exportBtn} onClick={handleExport}>
                        <DownloadIcon />
                        Export
                    </button>
                </div>
            </div>

            <div className={styles.revenueStats}>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Total Revenue</span>
                    <span className={styles.revenueValue}>{formatCurrency(totalRevenue)}</span>
                    <span className={`${styles.revenueChange} ${styles.positive}`}>
                        <TrendUpIcon /> +23.5% vs last period
                    </span>
                </div>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Average {selectedPeriod === 'This Month' ? 'Weekly' : 'Monthly'}</span>
                    <span className={styles.revenueValue}>{formatCurrency(avgRevenue)}</span>
                </div>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Best {selectedPeriod === 'This Month' ? 'Week' : 'Month'}</span>
                    <span className={styles.revenueValue}>{bestMonth.month}</span>
                    <span className={styles.revenueBest}>{formatCurrency(bestMonth.revenue)}</span>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <div className={styles.chartYAxis}>
                    <span>{formatCurrency(maxRevenue).replace('₹', '')}</span>
                    <span>{formatCurrency(maxRevenue * 0.75).replace('₹', '')}</span>
                    <span>{formatCurrency(maxRevenue * 0.5).replace('₹', '')}</span>
                    <span>{formatCurrency(maxRevenue * 0.25).replace('₹', '')}</span>
                    <span>0</span>
                </div>
                <div className={styles.chartArea}>
                    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className={styles.lineSvg}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={i}
                                x1="0" y1={i * 12.5} x2="100" y2={i * 12.5}
                                stroke="#e5e7eb" strokeWidth="0.2" strokeDasharray="1,1"
                            />
                        ))}
                        {/* Area */}
                        <path
                            d={`M0,${50 - (monthlyData[0].revenue / maxRevenue) * 45} ${monthlyData.map((d, i) =>
                                `L${(i / (monthlyData.length - 1)) * 100},${50 - (d.revenue / maxRevenue) * 45}`
                            ).join(' ')} L100,50 L0,50 Z`}
                            fill="url(#revenueGradient)"
                        />
                        {/* Line */}
                        <path
                            d={`M0,${50 - (monthlyData[0].revenue / maxRevenue) * 45} ${monthlyData.map((d, i) =>
                                `L${(i / (monthlyData.length - 1)) * 100},${50 - (d.revenue / maxRevenue) * 45}`
                            ).join(' ')}`}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="0.5"
                        />
                        {/* Data points */}
                        {monthlyData.map((d, i) => (
                            <circle
                                key={i}
                                cx={(i / (monthlyData.length - 1)) * 100}
                                cy={50 - (d.revenue / maxRevenue) * 45}
                                r="1"
                                fill="#f97316"
                            />
                        ))}
                    </svg>
                    <div className={styles.chartXAxis}>
                        {monthlyData.map((d, i) => (
                            <span key={i}>{d.month}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// ORDERS BY CHANNEL
// ============================================================================

function OrdersByChannel() {
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');
    const [showDropdown, setShowDropdown] = useState(false);

    const periods = ['This Month', 'Last Month', 'This Year'];

    const allData: Record<string, { name: string; orders: number; percentage: number; color: string }[]> = {
        'This Month': [
            { name: 'Dine-in', orders: 1450, percentage: 52, color: '#f97316' },
            { name: 'Takeaway', orders: 780, percentage: 28, color: '#3b82f6' },
            { name: 'Delivery', orders: 420, percentage: 15, color: '#22c55e' },
            { name: 'Online', orders: 140, percentage: 5, color: '#8b5cf6' },
        ],
        'Last Month': [
            { name: 'Dine-in', orders: 1280, percentage: 48, color: '#f97316' },
            { name: 'Takeaway', orders: 850, percentage: 32, color: '#3b82f6' },
            { name: 'Delivery', orders: 380, percentage: 14, color: '#22c55e' },
            { name: 'Online', orders: 160, percentage: 6, color: '#8b5cf6' },
        ],
        'This Year': [
            { name: 'Dine-in', orders: 15200, percentage: 50, color: '#f97316' },
            { name: 'Takeaway', orders: 9120, percentage: 30, color: '#3b82f6' },
            { name: 'Delivery', orders: 4560, percentage: 15, color: '#22c55e' },
            { name: 'Online', orders: 1520, percentage: 5, color: '#8b5cf6' },
        ],
    };

    const channels = allData[selectedPeriod] || allData['This Month'];
    const total = channels.reduce((sum, c) => sum + c.orders, 0);
    const changePercent = selectedPeriod === 'This Month' ? '+18%' : selectedPeriod === 'Last Month' ? '+12%' : '+25%';

    return (
        <div className={styles.channelCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Orders by Channel</h3>
                <div className={styles.dropdownContainer}>
                    <button
                        className={styles.periodBtn}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {selectedPeriod} <ChevronDownIcon />
                    </button>
                    {showDropdown && (
                        <div className={styles.dropdownMenu}>
                            {periods.map(period => (
                                <button
                                    key={period}
                                    className={`${styles.dropdownItem} ${selectedPeriod === period ? styles.active : ''}`}
                                    onClick={() => { setSelectedPeriod(period); setShowDropdown(false); }}
                                >
                                    {period}
                                    {selectedPeriod === period && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.channelTotal}>
                <span className={styles.channelTotalLabel}>Total Orders</span>
                <span className={styles.channelTotalValue}>{total.toLocaleString()}</span>
                <span className={`${styles.channelChange} ${styles.positive}`}>
                    <TrendUpIcon /> {changePercent}
                </span>
            </div>

            <div className={styles.channelList}>
                {channels.map((channel, index) => (
                    <div key={index} className={styles.channelItem}>
                        <div className={styles.channelInfo}>
                            <span className={styles.channelDot} style={{ background: channel.color }} />
                            <span className={styles.channelName}>{channel.name}</span>
                        </div>
                        <div className={styles.channelBar}>
                            <div
                                className={styles.channelBarFill}
                                style={{ width: `${channel.percentage}%`, background: channel.color }}
                            />
                        </div>
                        <div className={styles.channelStats}>
                            <span className={styles.channelOrders}>{channel.orders.toLocaleString()}</span>
                            <span className={styles.channelPercent}>{channel.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// PEAK HOURS CHART
// ============================================================================

function PeakHoursChart() {
    const hours = [
        { hour: '9AM', orders: 25 },
        { hour: '10AM', orders: 40 },
        { hour: '11AM', orders: 65 },
        { hour: '12PM', orders: 120 },
        { hour: '1PM', orders: 150 },
        { hour: '2PM', orders: 95 },
        { hour: '3PM', orders: 55 },
        { hour: '4PM', orders: 35 },
        { hour: '5PM', orders: 45 },
        { hour: '6PM', orders: 75 },
        { hour: '7PM', orders: 130 },
        { hour: '8PM', orders: 160 },
        { hour: '9PM', orders: 140 },
        { hour: '10PM', orders: 85 },
    ];

    const maxOrders = Math.max(...hours.map(h => h.orders));
    const peakHour = hours.find(h => h.orders === maxOrders);

    return (
        <div className={styles.peakCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Peak Hours</h3>
                <span className={styles.peakBadge}>Peak: {peakHour?.hour}</span>
            </div>

            <div className={styles.peakChart}>
                {hours.map((h, index) => (
                    <div key={index} className={styles.peakBar}>
                        <div
                            className={`${styles.peakBarFill} ${h.orders === maxOrders ? styles.peak : ''}`}
                            style={{ height: `${(h.orders / maxOrders) * 100}%` }}
                        />
                        <span className={styles.peakLabel}>{h.hour}</span>
                    </div>
                ))}
            </div>

            <div className={styles.peakStats}>
                <div className={styles.peakStat}>
                    <span className={styles.peakStatValue}>8PM</span>
                    <span className={styles.peakStatLabel}>Busiest Hour</span>
                </div>
                <div className={styles.peakStat}>
                    <span className={styles.peakStatValue}>160</span>
                    <span className={styles.peakStatLabel}>Peak Orders</span>
                </div>
                <div className={styles.peakStat}>
                    <span className={styles.peakStatValue}>12-2PM</span>
                    <span className={styles.peakStatLabel}>Lunch Rush</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TOP SELLING ITEMS
// ============================================================================

function TopSellingItems() {
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');
    const [showDropdown, setShowDropdown] = useState(false);

    const periods = ['This Week', 'This Month', 'Last Month'];

    // Different ordering/counts for different periods
    const getItemsForPeriod = (period: string) => {
        const baseItems = [...mockMenuItems].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 5);

        if (period === 'This Week') {
            // Shuffle order slightly and reduce counts
            return baseItems.map((item, i) => ({
                ...item,
                totalOrders: Math.floor(item.totalOrders * 0.25 * (1 + (i % 2 === 0 ? 0.1 : -0.1)))
            })).sort((a, b) => b.totalOrders - a.totalOrders);
        } else if (period === 'Last Month') {
            return baseItems.map((item, i) => ({
                ...item,
                totalOrders: Math.floor(item.totalOrders * 0.9 * (1 + (i % 3 === 0 ? 0.15 : -0.05)))
            })).sort((a, b) => b.totalOrders - a.totalOrders);
        }
        return baseItems;
    };

    const topItems = getItemsForPeriod(selectedPeriod);
    const maxOrders = topItems[0]?.totalOrders || 1;

    return (
        <div className={styles.topItemsCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Top Selling Items</h3>
                <div className={styles.dropdownContainer}>
                    <button
                        className={styles.periodBtn}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {selectedPeriod} <ChevronDownIcon />
                    </button>
                    {showDropdown && (
                        <div className={styles.dropdownMenu}>
                            {periods.map(period => (
                                <button
                                    key={period}
                                    className={`${styles.dropdownItem} ${selectedPeriod === period ? styles.active : ''}`}
                                    onClick={() => { setSelectedPeriod(period); setShowDropdown(false); }}
                                >
                                    {period}
                                    {selectedPeriod === period && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.topItemsList}>
                {topItems.map((item, index) => (
                    <div key={item._id} className={styles.topItem}>
                        <span className={styles.topItemRank}>{index + 1}</span>
                        <img src={item.images[0]} alt={item.name} className={styles.topItemImage} />
                        <div className={styles.topItemInfo}>
                            <span className={styles.topItemName}>{item.name}</span>
                            <span className={styles.topItemPrice}>{formatCurrency(item.price)}</span>
                        </div>
                        <div className={styles.topItemStats}>
                            <div className={styles.topItemBar}>
                                <div
                                    className={styles.topItemBarFill}
                                    style={{ width: `${(item.totalOrders / maxOrders) * 100}%` }}
                                />
                            </div>
                            <span className={styles.topItemOrders}>{item.totalOrders.toLocaleString()} orders</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// PAYMENT METHODS BREAKDOWN
// ============================================================================

function PaymentMethods() {
    const methods = [
        { name: 'Cash', amount: 285000, percentage: 45, color: '#22c55e' },
        { name: 'Card', amount: 190000, percentage: 30, color: '#3b82f6' },
        { name: 'UPI', amount: 127000, percentage: 20, color: '#8b5cf6' },
        { name: 'Wallet', amount: 32000, percentage: 5, color: '#f97316' },
    ];

    // Calculate stroke-dasharray for donut chart
    const total = 100;
    let offset = 0;

    return (
        <div className={styles.paymentCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Payment Methods</h3>
            </div>

            <div className={styles.paymentContent}>
                <div className={styles.paymentDonut}>
                    <svg viewBox="0 0 100 100">
                        {methods.map((method, index) => {
                            const strokeDasharray = `${method.percentage * 2.51} ${251.2 - method.percentage * 2.51}`;
                            const strokeDashoffset = -offset * 2.51;
                            offset += method.percentage;

                            return (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke={method.color}
                                    strokeWidth="15"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                />
                            );
                        })}
                    </svg>
                    <div className={styles.donutCenter}>
                        <span className={styles.donutTotal}>{formatCurrency(634000)}</span>
                        <span className={styles.donutLabel}>Total</span>
                    </div>
                </div>

                <div className={styles.paymentLegend}>
                    {methods.map((method, index) => (
                        <div key={index} className={styles.paymentItem}>
                            <div className={styles.paymentItemLeft}>
                                <span className={styles.paymentDot} style={{ background: method.color }} />
                                <span className={styles.paymentName}>{method.name}</span>
                            </div>
                            <div className={styles.paymentItemRight}>
                                <span className={styles.paymentAmount}>{formatCurrency(method.amount)}</span>
                                <span className={styles.paymentPercent}>{method.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// CUSTOMER ANALYTICS
// ============================================================================

function CustomerAnalytics() {
    return (
        <div className={styles.customerCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Customer Analytics</h3>
            </div>

            <div className={styles.customerStats}>
                <div className={styles.customerStat}>
                    <div className={styles.customerStatHeader}>
                        <span className={styles.customerStatLabel}>New Customers</span>
                        <span className={`${styles.customerChange} ${styles.positive}`}>+12%</span>
                    </div>
                    <span className={styles.customerStatValue}>248</span>
                    <span className={styles.customerStatPeriod}>This month</span>
                </div>

                <div className={styles.customerStat}>
                    <div className={styles.customerStatHeader}>
                        <span className={styles.customerStatLabel}>Returning</span>
                        <span className={`${styles.customerChange} ${styles.positive}`}>+8%</span>
                    </div>
                    <span className={styles.customerStatValue}>1,024</span>
                    <span className={styles.customerStatPeriod}>This month</span>
                </div>

                <div className={styles.customerStat}>
                    <div className={styles.customerStatHeader}>
                        <span className={styles.customerStatLabel}>Avg. Order Value</span>
                        <span className={`${styles.customerChange} ${styles.negative}`}>-3%</span>
                    </div>
                    <span className={styles.customerStatValue}>{formatCurrency(485)}</span>
                    <span className={styles.customerStatPeriod}>Per customer</span>
                </div>
            </div>

            <div className={styles.customerRatio}>
                <span className={styles.ratioLabel}>Customer Ratio</span>
                <div className={styles.ratioBar}>
                    <div className={styles.ratioNew} style={{ width: '20%' }}>
                        <span>New 20%</span>
                    </div>
                    <div className={styles.ratioReturning} style={{ width: '80%' }}>
                        <span>Returning 80%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN ANALYTICS PAGE
// ============================================================================

export default function AnalyticsPage() {
    const handleExportFullReport = () => {
        const reportDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create a styled HTML report
        const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Tavlo Analytics Report - ${reportDate}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .report {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f1f5f9;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        
        .report-title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .report-date {
            color: #64748b;
            font-size: 14px;
        }
        
        /* Executive Summary */
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 40px;
        }
        
        .summary-card {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        
        .summary-card.highlight {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
        }
        
        .summary-card.highlight .summary-label {
            color: rgba(255,255,255,0.8);
        }
        
        .summary-value {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .summary-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Sections */
        .section {
            margin-bottom: 32px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f97316;
            display: inline-block;
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        
        th {
            background: #f8fafc;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            padding: 12px 16px;
            text-align: left;
            border-bottom: 2px solid #e2e8f0;
        }
        
        td {
            padding: 14px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }
        
        tr:hover {
            background: #fafafa;
        }
        
        .amount {
            font-weight: 600;
            color: #059669;
        }
        
        .percent {
            color: #64748b;
        }
        
        /* Channel bars */
        .channel-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .channel-name {
            width: 100px;
            font-weight: 500;
        }
        
        .channel-bar {
            flex: 1;
            height: 24px;
            background: #f1f5f9;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .channel-fill {
            height: 100%;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
            color: white;
            font-size: 11px;
            font-weight: 600;
        }
        
        .channel-value {
            width: 80px;
            text-align: right;
            font-weight: 600;
        }
        
        /* Payment donut visualization */
        .payment-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .payment-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
        }
        
        .payment-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .payment-info {
            flex: 1;
        }
        
        .payment-name {
            font-weight: 500;
            font-size: 14px;
        }
        
        .payment-percent {
            font-size: 12px;
            color: #64748b;
        }
        
        .payment-amount {
            font-weight: 600;
            color: #1e293b;
        }
        
        /* Customer ratio */
        .ratio-bar {
            display: flex;
            height: 40px;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 12px;
        }
        
        .ratio-segment {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f1f5f9;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
        }
        
        @media print {
            body { background: white; }
            .report { padding: 20px; }
            .summary-grid { break-inside: avoid; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report">
        <div class="header">
            <div class="logo">🍽️ Tavlo</div>
            <h1 class="report-title">Analytics Report</h1>
            <p class="report-date">Generated on ${reportDate}</p>
        </div>
        
        <div class="summary-grid">
            <div class="summary-card highlight">
                <div class="summary-value">₹47.7L</div>
                <div class="summary-label">Total Revenue</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">2,847</div>
                <div class="summary-label">Total Orders</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">₹485</div>
                <div class="summary-label">Avg Order Value</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">4.6⭐</div>
                <div class="summary-label">Satisfaction</div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Revenue by Month</h2>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Orders</th>
                        <th>Growth</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>January</td><td class="amount">₹2,45,000</td><td>1,200</td><td class="percent">—</td></tr>
                    <tr><td>February</td><td class="amount">₹2,85,000</td><td>1,350</td><td class="percent">+16.3%</td></tr>
                    <tr><td>March</td><td class="amount">₹3,20,000</td><td>1,500</td><td class="percent">+12.3%</td></tr>
                    <tr><td>April</td><td class="amount">₹2,95,000</td><td>1,420</td><td class="percent">-7.8%</td></tr>
                    <tr><td>May</td><td class="amount">₹3,80,000</td><td>1,800</td><td class="percent">+28.8%</td></tr>
                    <tr><td>June</td><td class="amount">₹4,20,000</td><td>2,100</td><td class="percent">+10.5%</td></tr>
                    <tr><td>July</td><td class="amount">₹3,85,000</td><td>1,900</td><td class="percent">-8.3%</td></tr>
                    <tr><td>August</td><td class="amount">₹4,50,000</td><td>2,200</td><td class="percent">+16.9%</td></tr>
                    <tr><td>September</td><td class="amount">₹4,10,000</td><td>2,050</td><td class="percent">-8.9%</td></tr>
                    <tr><td>October</td><td class="amount">₹4,80,000</td><td>2,400</td><td class="percent">+17.1%</td></tr>
                    <tr><td>November</td><td class="amount">₹5,20,000</td><td>2,600</td><td class="percent">+8.3%</td></tr>
                    <tr><td>December</td><td class="amount">₹5,80,000</td><td>2,900</td><td class="percent">+11.5%</td></tr>
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2 class="section-title">🛒 Orders by Channel</h2>
            <div class="channel-row">
                <span class="channel-name">Dine-in</span>
                <div class="channel-bar">
                    <div class="channel-fill" style="width: 52%; background: linear-gradient(90deg, #f97316, #fb923c);">52%</div>
                </div>
                <span class="channel-value">1,450</span>
            </div>
            <div class="channel-row">
                <span class="channel-name">Takeaway</span>
                <div class="channel-bar">
                    <div class="channel-fill" style="width: 28%; background: linear-gradient(90deg, #3b82f6, #60a5fa);">28%</div>
                </div>
                <span class="channel-value">780</span>
            </div>
            <div class="channel-row">
                <span class="channel-name">Delivery</span>
                <div class="channel-bar">
                    <div class="channel-fill" style="width: 15%; background: linear-gradient(90deg, #22c55e, #4ade80);">15%</div>
                </div>
                <span class="channel-value">420</span>
            </div>
            <div class="channel-row">
                <span class="channel-name">Online</span>
                <div class="channel-bar">
                    <div class="channel-fill" style="width: 5%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
                </div>
                <span class="channel-value">140</span>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">💳 Payment Methods</h2>
            <div class="payment-grid">
                <div class="payment-item">
                    <div class="payment-dot" style="background: #22c55e;"></div>
                    <div class="payment-info">
                        <div class="payment-name">Cash</div>
                        <div class="payment-percent">45%</div>
                    </div>
                    <div class="payment-amount">₹2,85,000</div>
                </div>
                <div class="payment-item">
                    <div class="payment-dot" style="background: #3b82f6;"></div>
                    <div class="payment-info">
                        <div class="payment-name">Card</div>
                        <div class="payment-percent">30%</div>
                    </div>
                    <div class="payment-amount">₹1,90,000</div>
                </div>
                <div class="payment-item">
                    <div class="payment-dot" style="background: #8b5cf6;"></div>
                    <div class="payment-info">
                        <div class="payment-name">UPI</div>
                        <div class="payment-percent">20%</div>
                    </div>
                    <div class="payment-amount">₹1,27,000</div>
                </div>
                <div class="payment-item">
                    <div class="payment-dot" style="background: #f97316;"></div>
                    <div class="payment-info">
                        <div class="payment-name">Wallet</div>
                        <div class="payment-percent">5%</div>
                    </div>
                    <div class="payment-amount">₹32,000</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">👥 Customer Analytics</h2>
            <div class="summary-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="summary-card">
                    <div class="summary-value">248</div>
                    <div class="summary-label">New Customers</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">1,024</div>
                    <div class="summary-label">Returning</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">₹485</div>
                    <div class="summary-label">Avg Order Value</div>
                </div>
            </div>
            <p style="margin-top: 16px; color: #64748b; font-size: 14px;">Customer Ratio</p>
            <div class="ratio-bar">
                <div class="ratio-segment" style="width: 20%; background: linear-gradient(135deg, #f97316, #ea580c);">New 20%</div>
                <div class="ratio-segment" style="width: 80%; background: linear-gradient(135deg, #3b82f6, #2563eb);">Returning 80%</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by Tavlo Restaurant ERP • ${reportDate}</p>
            <p style="margin-top: 4px;">This report contains confidential business data</p>
        </div>
    </div>
    
    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
        `;

        // Open in new window and trigger print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(reportHTML);
            printWindow.document.close();
        }
    };

    return (

        <div className={styles.analyticsPage}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Analytics & Reports</h1>
                    <p className={styles.pageSubtitle}>Comprehensive insights into your restaurant performance</p>
                </div>
                <div className={styles.pageActions}>
                    <button className={styles.exportBtn} onClick={handleExportFullReport}>
                        <DownloadIcon />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className={styles.metricsRow}>
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(mockDashboardMetrics.fiscalYearRevenue)}
                    change={23.5}
                    subtitle="vs last year"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                    }
                    color="linear-gradient(135deg, #22c55e, #16a34a)"
                />
                <MetricCard
                    title="Total Orders"
                    value={mockDashboardMetrics.totalOrdersThisMonth.toLocaleString()}
                    change={18.2}
                    subtitle="vs last month"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="1" />
                        </svg>
                    }
                    color="linear-gradient(135deg, #3b82f6, #2563eb)"
                />
                <MetricCard
                    title="Avg. Order Value"
                    value={formatCurrency(485)}
                    change={-3.2}
                    subtitle="vs last month"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>
                    }
                    color="linear-gradient(135deg, #f97316, #ea580c)"
                />
                <MetricCard
                    title="Customer Satisfaction"
                    value="4.6"
                    change={5.8}
                    subtitle="avg rating"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    }
                    color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                />
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
                <RevenueChart />
                <OrdersByChannel />
            </div>

            {/* Second Row */}
            <div className={styles.secondRow}>
                <PeakHoursChart />
                <TopSellingItems />
            </div>

            {/* Third Row */}
            <div className={styles.thirdRow}>
                <PaymentMethods />
                <CustomerAnalytics />
            </div>
        </div>

    );
}

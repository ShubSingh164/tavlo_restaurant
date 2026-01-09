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
import { AdminLayout } from '@/components/layout';
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
    const [period, setPeriod] = useState('This Year');

    const monthlyData = [
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
    ];

    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
    const chartHeight = 200;

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Revenue Overview</h3>
                    <p className={styles.chartSubtitle}>Monthly revenue trends</p>
                </div>
                <div className={styles.chartControls}>
                    <button className={styles.periodBtn}>
                        <CalendarIcon />
                        {period}
                        <ChevronDownIcon />
                    </button>
                    <button className={styles.exportBtn}>
                        <DownloadIcon />
                        Export
                    </button>
                </div>
            </div>

            <div className={styles.revenueStats}>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Total Revenue</span>
                    <span className={styles.revenueValue}>{formatCurrency(4770000)}</span>
                    <span className={`${styles.revenueChange} ${styles.positive}`}>
                        <TrendUpIcon /> +23.5% vs last year
                    </span>
                </div>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Average Monthly</span>
                    <span className={styles.revenueValue}>{formatCurrency(397500)}</span>
                </div>
                <div className={styles.revenueStat}>
                    <span className={styles.revenueLabel}>Best Month</span>
                    <span className={styles.revenueValue}>December</span>
                    <span className={styles.revenueBest}>{formatCurrency(580000)}</span>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <div className={styles.chartYAxis}>
                    <span>6L</span>
                    <span>4.5L</span>
                    <span>3L</span>
                    <span>1.5L</span>
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
    const channels = [
        { name: 'Dine-in', orders: 1450, percentage: 52, color: '#f97316' },
        { name: 'Takeaway', orders: 780, percentage: 28, color: '#3b82f6' },
        { name: 'Delivery', orders: 420, percentage: 15, color: '#22c55e' },
        { name: 'Online', orders: 140, percentage: 5, color: '#8b5cf6' },
    ];

    const total = channels.reduce((sum, c) => sum + c.orders, 0);

    return (
        <div className={styles.channelCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Orders by Channel</h3>
                <button className={styles.periodBtn}>
                    This Month <ChevronDownIcon />
                </button>
            </div>

            <div className={styles.channelTotal}>
                <span className={styles.channelTotalLabel}>Total Orders</span>
                <span className={styles.channelTotalValue}>{total.toLocaleString()}</span>
                <span className={`${styles.channelChange} ${styles.positive}`}>
                    <TrendUpIcon /> +18%
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
                            <span className={styles.channelOrders}>{channel.orders}</span>
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
    const topItems = mockMenuItems
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 5);

    const maxOrders = topItems[0]?.totalOrders || 1;

    return (
        <div className={styles.topItemsCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Top Selling Items</h3>
                <button className={styles.periodBtn}>
                    This Month <ChevronDownIcon />
                </button>
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
                            <span className={styles.topItemOrders}>{item.totalOrders} orders</span>
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
    return (
        <AdminLayout title="Analytics">
            <div className={styles.analyticsPage}>
                {/* Header */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Analytics & Reports</h1>
                        <p className={styles.pageSubtitle}>Comprehensive insights into your restaurant performance</p>
                    </div>
                    <div className={styles.pageActions}>
                        <button className={styles.exportBtn}>
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
        </AdminLayout>
    );
}

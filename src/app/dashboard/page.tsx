'use client';

/**
 * Tavlo Restaurant ERP - Dashboard Page (Redesigned)
 * 
 * Professional admin dashboard featuring:
 * - KPI Cards: Sales, Orders, Customer Retention, Total Earning
 * - Sales Figures: Area chart showing monthly revenue trends
 * - Earning Categories: Bar chart breakdown by food categories
 * - Total Sales & Orders: Summary cards with trends
 * - Popular Menu Items: Ranked bestselling items
 * - Last Transactions: Recent order history
 * - Revenue by Payment: Donut chart for payment methods
 * 
 * @component DashboardPage
 * @route /dashboard
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { mockDashboardMetrics, mockMenuItems, mockCategories } from '@/data/mock-data';
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

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

// ============================================================================
// KPI CARD COMPONENT
// ============================================================================

interface KpiCardProps {
    title: string;
    value: string;
    subtitle?: string;
    change?: number;
    variant?: 'default' | 'primary' | 'danger';
}

function KpiCard({ title, value, subtitle, change, variant = 'default' }: KpiCardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className={`${styles.kpiCard} ${styles[variant]}`}>
            <div className={styles.kpiHeader}>
                <span className={styles.kpiTitle}>{title}</span>
                <button className={styles.kpiInfo}><InfoIcon /></button>
            </div>
            <div className={styles.kpiBody}>
                <span className={styles.kpiValue}>{value}</span>
                {change !== undefined && (
                    <span className={`${styles.kpiChange} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
                        {isPositive ? '+' : ''}{change.toFixed(1)}%
                    </span>
                )}
            </div>
            {subtitle && <span className={styles.kpiSubtitle}>{subtitle}</span>}

            {/* Mini sparkline for visual interest */}
            <div className={styles.kpiSparkline}>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                        d={isPositive
                            ? "M0,25 Q20,20 35,22 T50,15 T70,18 T85,10 T100,8"
                            : "M0,10 Q20,15 35,12 T50,20 T70,18 T85,22 T100,25"
                        }
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.3"
                    />
                </svg>
            </div>
        </div>
    );
}

// ============================================================================
// SALES FIGURES CHART (Area Chart)
// ============================================================================

function SalesFiguresChart() {
    const [period, setPeriod] = useState('Monthly');

    // Mock data points for the area chart
    const dataPoints = [
        { month: 'Jan', value: 180 },
        { month: 'Feb', value: 220 },
        { month: 'Mar', value: 200 },
        { month: 'Apr', value: 280 },
        { month: 'May', value: 320 },
        { month: 'Jun', value: 400 },  // Peak
        { month: 'Jul', value: 350 },
        { month: 'Aug', value: 380 },
        { month: 'Sep', value: 340 },
        { month: 'Oct', value: 360 },
        { month: 'Nov', value: 390 },
        { month: 'Dec', value: 420 },
    ];

    const maxValue = Math.max(...dataPoints.map(d => d.value));
    const chartHeight = 200;
    const chartWidth = 100;

    // Create SVG path for area chart
    const createPath = () => {
        const points = dataPoints.map((d, i) => {
            const x = (i / (dataPoints.length - 1)) * chartWidth;
            const y = chartHeight - (d.value / maxValue) * (chartHeight - 40);
            return `${x},${y}`;
        });
        return `M0,${chartHeight} L${points.join(' L')} L${chartWidth},${chartHeight} Z`;
    };

    const createLinePath = () => {
        const points = dataPoints.map((d, i) => {
            const x = (i / (dataPoints.length - 1)) * chartWidth;
            const y = chartHeight - (d.value / maxValue) * (chartHeight - 40);
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        });
        return points.join(' ');
    };

    // Find peak point (June in this case)
    const peakIndex = 5;
    const peakX = (peakIndex / (dataPoints.length - 1)) * 100;
    const peakY = ((1 - dataPoints[peakIndex].value / maxValue) * (chartHeight - 40)) + 20;

    return (
        <div className={styles.salesChart}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Sales Figures</h3>
                <div className={styles.chartControls}>
                    <button
                        className={`${styles.periodBtn} ${period === 'Monthly' ? styles.active : ''}`}
                        onClick={() => setPeriod('Monthly')}
                    >
                        Monthly <ChevronDownIcon />
                    </button>
                </div>
            </div>

            <div className={styles.chartArea}>
                {/* Y-Axis Labels */}
                <div className={styles.yAxis}>
                    <span>500</span>
                    <span>400</span>
                    <span>300</span>
                    <span>200</span>
                    <span>100</span>
                </div>

                {/* Chart SVG */}
                <div className={styles.chartSvgContainer}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className={styles.chartSvg}>
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={40 + (i * (chartHeight - 40) / 4)}
                                x2={chartWidth}
                                y2={40 + (i * (chartHeight - 40) / 4)}
                                stroke="#e5e7eb"
                                strokeWidth="0.5"
                                strokeDasharray="2,2"
                            />
                        ))}

                        {/* Area fill */}
                        <path d={createPath()} fill="url(#areaGradient)" />

                        {/* Line */}
                        <path d={createLinePath()} fill="none" stroke="#f97316" strokeWidth="2" />

                        {/* Peak point indicator */}
                        <circle cx={peakX} cy={peakY} r="4" fill="#f97316" />
                        <circle cx={peakX} cy={peakY} r="8" fill="#f97316" opacity="0.2" />
                    </svg>

                    {/* Peak value tooltip */}
                    <div className={styles.peakTooltip} style={{ left: `${peakX}%`, top: `${peakY - 15}px` }}>
                        <span className={styles.tooltipValue}>400</span>
                    </div>

                    {/* X-Axis Labels */}
                    <div className={styles.xAxis}>
                        {dataPoints.map((d, i) => (
                            <span key={i} className={i === peakIndex ? styles.activeMonth : ''}>{d.month}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EARNING CATEGORIES BAR CHART
// ============================================================================

function EarningCategoriesChart() {
    const [period, setPeriod] = useState('Last week');

    const weekData = [
        { day: 'Sun', food: 22, drink: 18, dessert: 8 },
        { day: 'Mon', food: 28, drink: 20, dessert: 12 },
        { day: 'Tue', food: 25, drink: 22, dessert: 15 },
        { day: 'Wed', food: 30, drink: 18, dessert: 10 },
        { day: 'Thu', food: 32, drink: 25, dessert: 18 },
        { day: 'Fri', food: 35, drink: 28, dessert: 20 },
        { day: 'Sat', food: 40, drink: 30, dessert: 22 },
    ];

    const maxValue = 45;

    return (
        <div className={styles.earningChart}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Earning Categories</h3>
                <button className={styles.periodBtn}>
                    {period} <ChevronDownIcon />
                </button>
            </div>

            <div className={styles.barChartContainer}>
                {/* Y-Axis */}
                <div className={styles.barYAxis}>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                </div>

                {/* Bars */}
                <div className={styles.barsWrapper}>
                    {weekData.map((day, index) => (
                        <div key={index} className={styles.barGroup}>
                            <div className={styles.bars}>
                                <div
                                    className={`${styles.bar} ${styles.foodBar}`}
                                    style={{ height: `${(day.food / maxValue) * 100}%` }}
                                />
                                <div
                                    className={`${styles.bar} ${styles.drinkBar}`}
                                    style={{ height: `${(day.drink / maxValue) * 100}%` }}
                                />
                                <div
                                    className={`${styles.bar} ${styles.dessertBar}`}
                                    style={{ height: `${(day.dessert / maxValue) * 100}%` }}
                                />
                            </div>
                            <span className={styles.barLabel}>{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className={styles.chartLegend}>
                <span className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.foodDot}`} />
                    Food
                </span>
                <span className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.drinkDot}`} />
                    Drink
                </span>
                <span className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.dessertDot}`} />
                    Dessert
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// TOTAL SALES & ORDERS CARDS
// ============================================================================

function TotalSalesCard() {
    return (
        <div className={styles.totalCard}>
            <div className={styles.totalHeader}>
                <span className={styles.totalLabel}>Total Sales</span>
                <span className={`${styles.totalChange} ${styles.positive}`}>
                    <TrendUpIcon /> 20.8%
                </span>
            </div>
            <div className={styles.totalValue}>{formatCurrency(4532000)}</div>
            <div className={styles.totalTrend}>
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={styles.trendLine}>
                    <path
                        d="M0,35 Q10,30 20,32 T40,25 T60,20 T80,15 T100,10"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}

function TotalOrdersCard() {
    return (
        <div className={styles.totalCard}>
            <div className={styles.totalHeader}>
                <span className={styles.totalLabel}>Total Orders</span>
                <span className={`${styles.totalChange} ${styles.negative}`}>
                    <TrendDownIcon /> 20.8%
                </span>
            </div>
            <div className={styles.totalValue}>3,284</div>
            <div className={styles.totalTrend}>
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={styles.trendLine}>
                    <path
                        d="M0,15 Q10,18 20,15 T40,22 T60,25 T80,30 T100,35"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}

// ============================================================================
// TOTAL PROFIT CARD (Featured)
// ============================================================================

function TotalProfitCard() {
    return (
        <div className={styles.profitCard}>
            <div className={styles.profitBadge}>Total Earning</div>
            <div className={styles.profitAmount}>{formatCurrency(1254000)}</div>
            <button className={styles.profitViewBtn}>View More</button>

            {/* Side panel with trend */}
            <div className={styles.profitTrend}>
                <span className={styles.profitTrendLabel}>Total Profit</span>
                <div className={styles.profitTrendChart}>
                    <svg viewBox="0 0 60 40" preserveAspectRatio="none">
                        <path
                            d="M0,30 Q15,25 30,20 T60,10"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.8"
                        />
                    </svg>
                </div>
                <span className={`${styles.profitTrendChange}`}>
                    <TrendUpIcon /> 20.8%
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// LAST TRANSACTIONS LIST
// ============================================================================

function LastTransactions() {
    const [period, setPeriod] = useState('Today');

    const transactions = [
        {
            name: 'Grilled Chicken Sandwich',
            time: '09:15 AM',
            price: 1030,
            image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=100&h=100&fit=crop'
        },
        {
            name: 'Veggie Burger',
            time: '09:42 AM',
            price: 1263,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop'
        },
        {
            name: 'Pepperoni Pizza',
            time: '11:23 AM',
            price: 1556,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop'
        },
        {
            name: 'Sushi Platter',
            time: '01:05 PM',
            price: 2069,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop'
        },
        {
            name: 'Chicken Biryani',
            time: '02:30 PM',
            price: 1030,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop'
        },
    ];

    return (
        <div className={styles.transactionsCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Last Transaction</h3>
                <button className={styles.periodBtn}>
                    {period} <ChevronDownIcon />
                </button>
            </div>

            <div className={styles.transactionsList}>
                {transactions.map((item, index) => (
                    <div key={index} className={styles.transactionItem}>
                        <div className={styles.transactionImage}>
                            <img src={item.image} alt={item.name} />
                        </div>
                        <div className={styles.transactionDetails}>
                            <span className={styles.transactionName}>{item.name}</span>
                            <span className={styles.transactionTime}>{item.time}</span>
                        </div>
                        <span className={styles.transactionPrice}>{formatCurrency(item.price)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// POPULAR MENU ITEMS (Trending)
// ============================================================================

function PopularMenuItems() {
    const popularItems = mockMenuItems
        .filter(item => item.isPopular)
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 5);

    return (
        <div className={styles.popularCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Popular Menu Items</h3>
                <a href="/menu" className={styles.viewAllLink}>View All</a>
            </div>

            <div className={styles.popularList}>
                {popularItems.map((item, index) => {
                    const category = mockCategories.find(c => c._id === item.categoryId);
                    const changePercent = Math.round((Math.random() - 0.3) * 40);

                    return (
                        <div key={item._id} className={styles.popularItem}>
                            <span className={styles.popularRank}>#{index + 1}</span>
                            <div className={styles.popularImage}>
                                <img src={item.images[0]} alt={item.name} />
                            </div>
                            <div className={styles.popularDetails}>
                                <span className={styles.popularName}>{item.name}</span>
                                <span className={styles.popularCategory}>
                                    {formatCurrency(item.discountedPrice || item.price)} · {category?.name}
                                </span>
                            </div>
                            <div className={styles.popularStats}>
                                <span className={styles.popularOrders}>{item.totalOrders.toLocaleString()}</span>
                                <span className={`${styles.popularChange} ${changePercent >= 0 ? styles.positive : styles.negative}`}>
                                    {changePercent >= 0 ? '+' : ''}{changePercent}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// SPECIALTIES SALES (with availability)
// ============================================================================

function SpecialtiesSales() {
    const specialties = [
        { name: 'Pasta Alfredo', category: 'Food', change: 20.8, available: 85 },
        { name: 'Margherita Pizza', category: 'Food', change: 15.2, available: 92 },
        { name: 'Caesar Salad', category: 'Food', change: -5.4, available: 78 },
    ];

    return (
        <div className={styles.specialtiesCard}>
            <h3 className={styles.cardTitle}>Specialties Sales</h3>

            <div className={styles.specialtiesList}>
                {specialties.map((item, index) => (
                    <div key={index} className={styles.specialtyItem}>
                        <div className={styles.specialtyImage}>
                            <img
                                src={`https://images.unsplash.com/photo-${1565299624946 + index}-b28f40a0ae38?w=80&h=80&fit=crop`}
                                alt={item.name}
                            />
                        </div>
                        <div className={styles.specialtyInfo}>
                            <span className={styles.specialtyCategory}>{item.category}</span>
                            <span className={styles.specialtyName}>{item.name}</span>
                        </div>
                        <span className={`${styles.specialtyChange} ${item.change >= 0 ? styles.positive : styles.negative}`}>
                            {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                        </span>
                        <div className={styles.specialtyAvailability}>
                            <span className={styles.availLabel}>Available</span>
                            <div className={styles.availBar}>
                                <div className={styles.availFill} style={{ width: `${item.available}%` }} />
                            </div>
                            <span className={styles.availPercent}>{item.available}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// CUSTOMER REVIEWS
// ============================================================================

function CustomerReviews() {
    const reviews = [
        {
            name: 'Mical Doe',
            date: '2 days ago',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
            rating: 5,
        },
        {
            name: 'Stepni Doe',
            date: '3 days ago',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
            rating: 4,
        },
    ];

    return (
        <div className={styles.reviewsCard}>
            <h3 className={styles.cardTitle}>Customer Review</h3>

            <div className={styles.reviewsList}>
                {reviews.map((review, index) => (
                    <div key={index} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <img src={review.avatar} alt={review.name} className={styles.reviewAvatar} />
                            <div className={styles.reviewMeta}>
                                <span className={styles.reviewName}>{review.name}</span>
                                <span className={styles.reviewDate}>{review.date}</span>
                            </div>
                            <div className={styles.reviewRating}>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} />
                                ))}
                            </div>
                        </div>
                        <p className={styles.reviewText}>{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
    return (
        <AdminLayout title="Dashboard">
            <div className={styles.dashboard}>
                {/* Row 1: KPI Cards */}
                <section className={styles.kpiRow}>
                    <KpiCard
                        title="Sales"
                        value={formatCurrency(11526)}
                        subtitle="Today"
                        change={10.7}
                        variant="primary"
                    />
                    <KpiCard
                        title="Ongoing Orders"
                        value="13"
                        subtitle="Orders in Kitchen"
                        change={0}
                    />
                    <KpiCard
                        title="Customer Retention"
                        value="12.3%"
                        subtitle="This Month"
                        change={-5.1}
                    />
                    <TotalProfitCard />
                </section>

                {/* Row 2: Charts Row */}
                <section className={styles.chartsRow}>
                    <SalesFiguresChart />
                    <div className={styles.chartsRight}>
                        <EarningCategoriesChart />
                        <div className={styles.totalsRow}>
                            <TotalSalesCard />
                            <TotalOrdersCard />
                        </div>
                    </div>
                </section>

                {/* Row 3: Popular Items + Transactions */}
                <section className={styles.dataRow}>
                    <PopularMenuItems />
                    <LastTransactions />
                </section>

                {/* Row 4: Specialties + Reviews */}
                <section className={styles.bottomRow}>
                    <SpecialtiesSales />
                    <CustomerReviews />
                </section>
            </div>
        </AdminLayout>
    );
}

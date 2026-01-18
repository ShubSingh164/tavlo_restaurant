'use client';

/**
 * Tavlo Restaurant ERP - Billing & Payments Page
 * 
 * Payment management with:
 * - Payment transactions history
 * - Invoice generation
 * - Payment method breakdown
 * - Settlement tracking
 * 
 * @component BillingPage
 * @route /billing
 */

import React, { useState } from 'react';

import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Mock payment data
const mockPayments = [
    { id: 'pay_001', orderId: '#ORD-0108', date: '2026-01-09 14:30', customer: 'Rahul Sharma', amount: 1250, method: 'UPI', status: 'completed' },
    { id: 'pay_002', orderId: '#ORD-0107', date: '2026-01-09 13:45', customer: 'Priya Patel', amount: 890, method: 'Card', status: 'completed' },
    { id: 'pay_003', orderId: '#ORD-0106', date: '2026-01-09 12:20', customer: 'Amit Kumar', amount: 2100, method: 'Cash', status: 'completed' },
    { id: 'pay_004', orderId: '#ORD-0105', date: '2026-01-09 11:55', customer: 'Sneha Gupta', amount: 750, method: 'UPI', status: 'pending' },
    { id: 'pay_005', orderId: '#ORD-0104', date: '2026-01-09 11:10', customer: 'Vikram Singh', amount: 3200, method: 'Card', status: 'completed' },
    { id: 'pay_006', orderId: '#ORD-0103', date: '2026-01-09 10:30', customer: 'Neha Reddy', amount: 480, method: 'Cash', status: 'completed' },
    { id: 'pay_007', orderId: '#ORD-0102', date: '2026-01-08 20:15', customer: 'Rahul Sharma', amount: 1680, method: 'UPI', status: 'refunded' },
    { id: 'pay_008', orderId: '#ORD-0101', date: '2026-01-08 19:40', customer: 'Priya Patel', amount: 2450, method: 'Card', status: 'completed' },
];

// Icons
const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

// Stats Card
function StatsCard({ title, value, subtitle, icon, color }: { title: string; value: string; subtitle: string; icon: React.ReactNode; color: string }) {
    return (
        <div className={styles.statsCard}>
            <div className={styles.statsIcon} style={{ background: color }}>
                {icon}
            </div>
            <div className={styles.statsContent}>
                <span className={styles.statsTitle}>{title}</span>
                <span className={styles.statsValue}>{value}</span>
                <span className={styles.statsSubtitle}>{subtitle}</span>
            </div>
        </div>
    );
}

// Payment Method Chart
function PaymentMethodChart() {
    const methods = [
        { name: 'UPI', amount: 45200, percentage: 42, color: '#8b5cf6' },
        { name: 'Card', amount: 38500, percentage: 36, color: '#3b82f6' },
        { name: 'Cash', amount: 23800, percentage: 22, color: '#22c55e' },
    ];

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Payment Methods</h3>
            <div className={styles.methodsList}>
                {methods.map((method, i) => (
                    <div key={i} className={styles.methodItem}>
                        <div className={styles.methodInfo}>
                            <span className={styles.methodDot} style={{ background: method.color }} />
                            <span className={styles.methodName}>{method.name}</span>
                        </div>
                        <div className={styles.methodBar}>
                            <div className={styles.methodBarFill} style={{ width: `${method.percentage}%`, background: method.color }} />
                        </div>
                        <div className={styles.methodStats}>
                            <span className={styles.methodAmount}>{formatCurrency(method.amount)}</span>
                            <span className={styles.methodPercent}>{method.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Recent Settlements
function RecentSettlements() {
    const settlements = [
        { date: '2026-01-08', amount: 45600, bank: 'HDFC Bank ****4521', status: 'completed' },
        { date: '2026-01-07', amount: 52300, bank: 'HDFC Bank ****4521', status: 'completed' },
        { date: '2026-01-06', amount: 38900, bank: 'HDFC Bank ****4521', status: 'pending' },
    ];

    return (
        <div className={styles.settlementsCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Recent Settlements</h3>
                <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.settlementsList}>
                {settlements.map((s, i) => (
                    <div key={i} className={styles.settlementItem}>
                        <div className={styles.settlementInfo}>
                            <span className={styles.settlementDate}>
                                {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className={styles.settlementBank}>{s.bank}</span>
                        </div>
                        <div className={styles.settlementAmount}>
                            <span className={styles.amountValue}>{formatCurrency(s.amount)}</span>
                            <span className={`${styles.settlementStatus} ${styles[s.status]}`}>{s.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function BillingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; color: string }> = {
            completed: { bg: '#dcfce7', color: '#16a34a' },
            pending: { bg: '#fef3c7', color: '#d97706' },
            refunded: { bg: '#fee2e2', color: '#dc2626' },
        };
        return config[status] || config.completed;
    };

    const getMethodIcon = (method: string) => {
        const icons: Record<string, string> = {
            UPI: '📱',
            Card: '💳',
            Cash: '💵',
        };
        return icons[method] || '💰';
    };

    const filteredPayments = mockPayments.filter(p => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (searchQuery && !p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) && !p.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const todayTotal = mockPayments.filter(p => p.date.startsWith('2026-01-09')).reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

    return (
        
            <div className={styles.billingPage}>
                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <StatsCard
                        title="Today's Collection"
                        value={formatCurrency(todayTotal)}
                        subtitle="8 transactions"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
                        color="linear-gradient(135deg, #22c55e, #16a34a)"
                    />
                    <StatsCard
                        title="Pending Payments"
                        value={formatCurrency(pendingAmount)}
                        subtitle="1 transaction"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        color="linear-gradient(135deg, #f97316, #ea580c)"
                    />
                    <StatsCard
                        title="This Week"
                        value={formatCurrency(156800)}
                        subtitle="234 transactions"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                        color="linear-gradient(135deg, #3b82f6, #2563eb)"
                    />
                    <StatsCard
                        title="This Month"
                        value={formatCurrency(845200)}
                        subtitle="1,024 transactions"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>}
                        color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                    />
                </div>

                {/* Charts Row */}
                <div className={styles.chartsRow}>
                    <PaymentMethodChart />
                    <RecentSettlements />
                </div>

                {/* Transactions Table */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerLeft}>
                            <h2 className={styles.tableTitle}>Recent Transactions</h2>
                        </div>
                        <div className={styles.headerRight}>
                            <div className={styles.searchBox}>
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search by order or customer..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className={styles.filterSelect}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            <button className={styles.exportBtn}>
                                <DownloadIcon />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        {/* Desktop Table View */}
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Order</th>
                                    <th>Date & Time</th>
                                    <th>Customer</th>
                                    <th>Method</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => {
                                    const status = getStatusBadge(payment.status);
                                    return (
                                        <tr key={payment.id}>
                                            <td><span className={styles.transactionId}>{payment.id}</span></td>
                                            <td><span className={styles.orderId}>{payment.orderId}</span></td>
                                            <td>{payment.date}</td>
                                            <td>{payment.customer}</td>
                                            <td>
                                                <span className={styles.methodBadge}>
                                                    {getMethodIcon(payment.method)} {payment.method}
                                                </span>
                                            </td>
                                            <td><span className={styles.amount}>{formatCurrency(payment.amount)}</span></td>
                                            <td>
                                                <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className={styles.mobileCards}>
                            {filteredPayments.map(payment => {
                                const status = getStatusBadge(payment.status);
                                return (
                                    <div key={payment.id} className={styles.mobileCard}>
                                        <div className={styles.mobileCardHeader}>
                                            <div className={styles.mobileCardTitleRow}>
                                                <span className={styles.orderId}>{payment.orderId}</span>
                                                <span className={styles.transactionId}>{payment.id}</span>
                                            </div>
                                            <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                                                {payment.status}
                                            </span>
                                        </div>
                                        <div className={styles.mobileCardBody}>
                                            <div className={styles.mobileCardItem}>
                                                <span className={styles.mobileCardLabel}>Customer</span>
                                                <span className={styles.mobileCardValue}>{payment.customer}</span>
                                            </div>
                                            <div className={styles.mobileCardItem}>
                                                <span className={styles.mobileCardLabel}>Date</span>
                                                <span className={styles.mobileCardValue}>{payment.date}</span>
                                            </div>
                                        </div>
                                        <div className={styles.mobileCardFooter}>
                                            <span className={styles.mobileCardTotal}>{formatCurrency(payment.amount)}</span>
                                            <span className={styles.methodBadge}>
                                                {getMethodIcon(payment.method)} {payment.method}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        
    );
}

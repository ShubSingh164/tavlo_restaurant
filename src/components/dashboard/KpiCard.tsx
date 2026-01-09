'use client';

/**
 * Tavlo Restaurant ERP - KPI Card Component
 * 
 * Displays key performance indicators with value, label, and change percentage.
 * Used in dashboard to show revenue, orders, etc.
 * 
 * @component KpiCard
 * @backend Data comes from dashboard API
 * @api GET /api/dashboard/stats
 */

import React from 'react';
import styles from './KpiCard.module.css';

interface KpiCardProps {
    label: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary';
}

const TrendUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
    </svg>
);

const TrendDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 18l-9.5-9.5-5 5L1 6" />
        <path d="M17 18h6v-6" />
    </svg>
);

/**
 * KpiCard - displays a key metric with optional trend indicator
 */
export default function KpiCard({
    label,
    value,
    change,
    changeLabel = 'Today',
    icon,
    variant = 'default',
}: KpiCardProps) {
    const isPositive = change !== undefined && change >= 0;
    const hasChange = change !== undefined;

    return (
        <div className={`${styles.kpiCard} ${variant === 'primary' ? styles.primary : ''}`}>
            <div className={styles.header}>
                <span className={styles.label}>
                    {label}
                    {icon && <span className={styles.icon}>{icon}</span>}
                </span>
            </div>

            <div className={styles.value}>{value}</div>

            {hasChange && (
                <div className={styles.footer}>
                    <span className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
                        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
                    </span>
                    <span className={styles.changeLabel}>{changeLabel}</span>
                </div>
            )}
        </div>
    );
}

'use client';

/**
 * Tavlo Restaurant ERP - Taxation & Accounting Page
 * 
 * Tax management with:
 * - GST reports
 * - Tax breakdown by category
 * - Invoice management
 * - Compliance tracking
 * 
 * @component TaxationPage
 * @route /taxation
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Mock tax data
const mockTaxSummary = {
    totalTaxCollected: 84520,
    cgst: 42260,
    sgst: 42260,
    pendingFilings: 1,
    lastFiled: '2025-12-31',
};

const mockTaxByCategory = [
    { category: 'Food (5%)', taxable: 680000, cgst: 17000, sgst: 17000, total: 34000 },
    { category: 'Beverages (12%)', taxable: 125000, cgst: 7500, sgst: 7500, total: 15000 },
    { category: 'Desserts (5%)', taxable: 98000, cgst: 2450, sgst: 2450, total: 4900 },
    { category: 'Packed Items (18%)', taxable: 45000, cgst: 4050, sgst: 4050, total: 8100 },
];

const mockFilings = [
    { period: 'December 2025', dueDate: '2026-01-20', status: 'pending', amount: 84520 },
    { period: 'November 2025', dueDate: '2025-12-20', status: 'filed', amount: 76890, filedDate: '2025-12-18' },
    { period: 'October 2025', dueDate: '2025-11-20', status: 'filed', amount: 82340, filedDate: '2025-11-15' },
    { period: 'September 2025', dueDate: '2025-10-20', status: 'filed', amount: 71200, filedDate: '2025-10-19' },
];

// Icons
const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const AlertIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

// Stats Cards
function TaxStats() {
    return (
        <div className={styles.statsRow}>
            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statLabel}>Total Tax Collected</span>
                    <span className={styles.statValue}>{formatCurrency(mockTaxSummary.totalTaxCollected)}</span>
                    <span className={styles.statPeriod}>This Month</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '12px' }}>CGST</span>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statLabel}>CGST Collected</span>
                    <span className={styles.statValue}>{formatCurrency(mockTaxSummary.cgst)}</span>
                    <span className={styles.statPeriod}>2.5% Rate</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '12px' }}>SGST</span>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statLabel}>SGST Collected</span>
                    <span className={styles.statValue}>{formatCurrency(mockTaxSummary.sgst)}</span>
                    <span className={styles.statPeriod}>2.5% Rate</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.alertCard}`}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                    <AlertIcon />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statLabel}>Pending Filings</span>
                    <span className={styles.statValue}>{mockTaxSummary.pendingFilings}</span>
                    <span className={styles.statPeriod}>Due Jan 20, 2026</span>
                </div>
            </div>
        </div>
    );
}

// Tax by Category Table
function TaxByCategory() {
    const totalTaxable = mockTaxByCategory.reduce((sum, c) => sum + c.taxable, 0);
    const totalCgst = mockTaxByCategory.reduce((sum, c) => sum + c.cgst, 0);
    const totalSgst = mockTaxByCategory.reduce((sum, c) => sum + c.sgst, 0);
    const totalTax = mockTaxByCategory.reduce((sum, c) => sum + c.total, 0);

    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Tax by Category</h2>
                <button className={styles.exportBtn}>
                    <DownloadIcon />
                    Export
                </button>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Taxable Amount</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>Total Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTaxByCategory.map((row, i) => (
                            <tr key={i}>
                                <td><span className={styles.categoryName}>{row.category}</span></td>
                                <td>{formatCurrency(row.taxable)}</td>
                                <td>{formatCurrency(row.cgst)}</td>
                                <td>{formatCurrency(row.sgst)}</td>
                                <td><span className={styles.totalTax}>{formatCurrency(row.total)}</span></td>
                            </tr>
                        ))}
                        <tr className={styles.totalRow}>
                            <td><strong>Total</strong></td>
                            <td><strong>{formatCurrency(totalTaxable)}</strong></td>
                            <td><strong>{formatCurrency(totalCgst)}</strong></td>
                            <td><strong>{formatCurrency(totalSgst)}</strong></td>
                            <td><strong className={styles.grandTotal}>{formatCurrency(totalTax)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// GST Filings
function GstFilings() {
    const getStatusBadge = (status: string) => {
        return status === 'pending'
            ? { bg: '#fef3c7', color: '#d97706', label: 'Pending' }
            : { bg: '#dcfce7', color: '#16a34a', label: 'Filed' };
    };

    return (
        <div className={styles.filingsCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.tableTitle}>GST Filing History</h2>
                <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.filingsList}>
                {mockFilings.map((filing, i) => {
                    const status = getStatusBadge(filing.status);
                    return (
                        <div key={i} className={`${styles.filingItem} ${filing.status === 'pending' ? styles.pendingFiling : ''}`}>
                            <div className={styles.filingInfo}>
                                <span className={styles.filingPeriod}>{filing.period}</span>
                                <span className={styles.filingDue}>
                                    {filing.status === 'pending' ? `Due: ${filing.dueDate}` : `Filed: ${filing.filedDate}`}
                                </span>
                            </div>
                            <div className={styles.filingAmount}>
                                <span className={styles.amountValue}>{formatCurrency(filing.amount)}</span>
                                <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                                    {status.label}
                                </span>
                            </div>
                            {filing.status === 'pending' && (
                                <button className={styles.fileBtn}>File Now</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function TaxationPage() {
    return (
        <AdminLayout title="Taxation & Accounting">
            <div className={styles.taxationPage}>
                <TaxStats />

                <div className={styles.contentRow}>
                    <TaxByCategory />
                    <GstFilings />
                </div>

                {/* Quick Actions */}
                <div className={styles.actionsCard}>
                    <h3 className={styles.actionsTitle}>Quick Actions</h3>
                    <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Generate GST Report
                        </button>
                        <button className={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download GSTR-1
                        </button>
                        <button className={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download GSTR-3B
                        </button>
                        <button className={styles.actionBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Set Filing Reminder
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

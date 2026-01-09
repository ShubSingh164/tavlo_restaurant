'use client';

/**
 * Tavlo Restaurant ERP - Status Tabs Component
 * 
 * Filter tabs for order status (All, Completed, Ongoing, Cancelled).
 * 
 * @component StatusTabs
 */

import React from 'react';
import styles from './StatusTabs.module.css';

interface TabItem {
    id: string;
    label: string;
    count?: number;
    color?: 'success' | 'warning' | 'error' | 'default';
}

interface StatusTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

/**
 * StatusTabs - filter tabs with counts
 */
export default function StatusTabs({ tabs, activeTab, onChange }: StatusTabsProps) {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''} ${tab.color ? styles[tab.color] : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    <span className={styles.label}>{tab.label}</span>
                    {tab.count !== undefined && (
                        <span className={styles.count}>{tab.count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

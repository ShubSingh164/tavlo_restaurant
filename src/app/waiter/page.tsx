'use client';

/**
 * Tavlo Restaurant — Waiter Dashboard
 * 
 * Mobile-first interface for waiters to:
 * - View assigned tables with live status
 * - Track order progress (per-item status)
 * - Handle service requests from customers
 * - Quick actions: cleanup, new order, daily summary
 * 
 * @route /waiter
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaiterStore, type ServiceRequest, type ItemStatusOverride } from '@/store/waiter-store';
import { useThemeStore } from '@/store/theme-store';
import { mockTables, mockOrders, mockStaff } from '@/data/mock-data';
import type { IOrder, IOrderItem, ITable } from '@/types';
import styles from './page.module.css';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const BellIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const ClipboardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
);

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
    </svg>
);

// ============================================================================
// REQUEST TYPE LABELS & ICONS
// ============================================================================

const REQUEST_META: Record<string, { icon: string; label: string; color: string }> = {
    'call-waiter': { icon: '🔔', label: 'Call Waiter', color: '#f97316' },
    'request-bill': { icon: '🧾', label: 'Request Bill', color: '#8b5cf6' },
    'water-refill': { icon: '💧', label: 'Water / Refills', color: '#3b82f6' },
    'extra-cutlery': { icon: '🍴', label: 'Extra Cutlery', color: '#10b981' },
    'table-cleanup': { icon: '🧹', label: 'Table Cleanup', color: '#eab308' },
};

// ============================================================================
// TABLE STATUS CONFIG
// ============================================================================

const TABLE_STATUS: Record<string, { color: string; bg: string; label: string }> = {
    'available': { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Free' },
    'occupied': { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'Occupied' },
    'reserved': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'Reserved' },
    'cleaning': { color: '#eab308', bg: 'rgba(234,179,8,0.15)', label: 'Cleaning' },
};

// ============================================================================
// ITEM STATUS CONFIG
// ============================================================================

const ITEM_STATUS: Record<string, { color: string; bg: string; icon: string; label: string }> = {
    'pending': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '🔴', label: 'Pending' },
    'preparing': { color: '#eab308', bg: 'rgba(234,179,8,0.15)', icon: '🟡', label: 'Preparing' },
    'ready': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '🔵', label: 'Ready' },
    'served': { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', icon: '✅', label: 'Served' },
};

// ============================================================================
// HELPERS
// ============================================================================

function timeAgo(timestamp: number | Date): string {
    const now = Date.now();
    const ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
    const diffMs = now - ts;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ${diffMin % 60}m ago`;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WaiterDashboardPage() {
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const waiterStore = useWaiterStore();

    // UI State
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'tables' | 'requests' | 'orders'>('tables');
    const [isLoaded, setIsLoaded] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Current waiter (mock — using Amit Kumar, the waiter from mock data)
    const currentWaiter = mockStaff.find(s => s.role === 'waiter') || mockStaff[2];

    // Seed some demo service requests on first load
    useEffect(() => {
        setIsLoaded(true);
        if (waiterStore.requests.length === 0) {
            waiterStore.addRequest('table_004', '04', 'call-waiter');
            waiterStore.addRequest('table_010', '10', 'water-refill');
            waiterStore.addRequest('table_009', '09', 'request-bill');
        }
    }, []);

    // Toast helper
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2500);
    };

    // ─── Computed Data ────────────────────────────────────────────────────────

    // Active orders (not completed or cancelled)
    const activeOrders = useMemo(() => {
        return mockOrders.filter(
            (o) => o.status !== 'completed' && o.status !== 'cancelled'
        );
    }, []);

    // Tables with their associated orders
    const tablesWithOrders = useMemo(() => {
        return mockTables.map((table) => {
            const tableOrders = mockOrders.filter(
                (o) => o.tableId === table._id && o.status !== 'completed' && o.status !== 'cancelled'
            );
            const totalAmount = tableOrders.reduce((sum, o) => sum + o.total, 0);
            return { ...table, orders: tableOrders, totalAmount };
        });
    }, []);

    // Stats
    const stats = useMemo(() => {
        const occupiedCount = mockTables.filter((t) => t.status === 'occupied').length;
        const activeOrderCount = activeOrders.length;
        const pendingRequests = waiterStore.getPendingCount();
        const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);

        return { occupiedCount, activeOrderCount, pendingRequests, totalRevenue };
    }, [activeOrders, waiterStore.requests]);

    // ─── Order Item Status Helpers ───────────────────────────────────────────

    const getResolvedItemStatus = (orderId: string, item: IOrderItem): ItemStatusOverride => {
        return waiterStore.getItemStatus(orderId, item.menuItemId, item.status);
    };

    const getOrderProgress = (order: IOrder): number => {
        const total = order.items.length;
        if (total === 0) return 0;
        const served = order.items.filter(
            (item) => getResolvedItemStatus(order._id || '', item) === 'served'
        ).length;
        return Math.round((served / total) * 100);
    };

    const isAllServed = (order: IOrder): boolean => {
        return order.items.every(
            (item) => getResolvedItemStatus(order._id || '', item) === 'served'
        );
    };

    // ─── Actions ─────────────────────────────────────────────────────────────

    const handleAcceptRequest = (id: string) => {
        waiterStore.acceptRequest(id);
        showToast('Request accepted — heading to table');
    };

    const handleCompleteRequest = (id: string) => {
        waiterStore.completeRequest(id);
        showToast('Request completed ✓');
    };

    const handleMarkItemServed = (orderId: string, menuItemId: string) => {
        waiterStore.updateItemStatus(orderId, menuItemId, 'served');
        showToast('Item marked as served ✓');
    };

    const handleMarkAllServed = (order: IOrder) => {
        const itemIds = order.items.map((i) => i.menuItemId);
        waiterStore.markOrderAllServed(order._id || '', itemIds);
        showToast(`Order ${order.orderNumber} — All items served ✓`);
    };

    const handleAdvanceItemStatus = (orderId: string, item: IOrderItem) => {
        const current = getResolvedItemStatus(orderId, item);
        const flow: ItemStatusOverride[] = ['pending', 'preparing', 'ready', 'served'];
        const currentIndex = flow.indexOf(current);
        if (currentIndex < flow.length - 1) {
            const nextStatus = flow[currentIndex + 1];
            waiterStore.updateItemStatus(orderId, item.menuItemId, nextStatus);
            showToast(`${item.name} → ${ITEM_STATUS[nextStatus].label}`);
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className={`${styles.page} ${isLoaded ? styles.loaded : ''} ${isDarkMode ? '' : styles.lightMode}`}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <ArrowLeftIcon />
                    </button>
                    <div className={styles.headerInfo}>
                        <span className={styles.greeting}>{getGreeting()} 👋</span>
                        <h1 className={styles.waiterName}>{currentWaiter.name}</h1>
                    </div>
                    <div className={styles.headerActions}>
                        <motion.button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </motion.button>
                        <button className={styles.bellBtn}>
                            <BellIcon />
                            {stats.pendingRequests > 0 && (
                                <span className={styles.bellBadge}>{stats.pendingRequests}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statPill}>
                        <UsersIcon />
                        <span>{stats.occupiedCount} Tables</span>
                    </div>
                    <div className={styles.statPill}>
                        <ClipboardIcon />
                        <span>{stats.activeOrderCount} Orders</span>
                    </div>
                    <div className={`${styles.statPill} ${stats.pendingRequests > 0 ? styles.statAlert : ''}`}>
                        <AlertIcon />
                        <span>{stats.pendingRequests} Requests</span>
                    </div>
                    <div className={styles.statPill}>
                        <span className={styles.statCurrency}>₹</span>
                        <span>{stats.totalRevenue.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.tabBar}>
                    {(['tables', 'requests', 'orders'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'tables' && '🪑'}
                            {tab === 'requests' && '🔔'}
                            {tab === 'orders' && '📋'}
                            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                            {tab === 'requests' && stats.pendingRequests > 0 && (
                                <span className={styles.tabBadge}>{stats.pendingRequests}</span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Main Content ───────────────────────────────────────────── */}
            <main className={styles.main}>
                <AnimatePresence mode="wait">

                    {/* ─── TABLES TAB ───────────────────────────────────── */}
                    {activeTab === 'tables' && (
                        <motion.div
                            key="tables"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>My Tables</h2>
                                <span className={styles.sectionCount}>{mockTables.length} total</span>
                            </div>
                            <div className={styles.tableGrid}>
                                {tablesWithOrders.map((table, index) => {
                                    const statusConfig = TABLE_STATUS[table.status] || TABLE_STATUS['available'];
                                    return (
                                        <motion.div
                                            key={table._id}
                                            className={styles.tableCard}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => {
                                                if (table.orders.length > 0) {
                                                    setActiveTab('orders');
                                                    setExpandedOrder(table.orders[0]._id || null);
                                                }
                                            }}
                                        >
                                            {/* Status indicator line */}
                                            <div
                                                className={styles.tableStatusLine}
                                                style={{ background: statusConfig.color }}
                                            />

                                            <div className={styles.tableCardContent}>
                                                <div className={styles.tableTop}>
                                                    <span className={styles.tableNumber}>T-{table.tableNumber}</span>
                                                    <span
                                                        className={styles.tableBadge}
                                                        style={{ color: statusConfig.color, background: statusConfig.bg }}
                                                    >
                                                        {statusConfig.label}
                                                    </span>
                                                </div>

                                                <span className={styles.tableName}>{table.name}</span>

                                                <div className={styles.tableBottom}>
                                                    <div className={styles.tableCapacity}>
                                                        <UsersIcon />
                                                        <span>{table.status === 'occupied' ? Math.ceil(table.capacity * 0.7) : 0}/{table.capacity}</span>
                                                    </div>
                                                    {table.totalAmount > 0 && (
                                                        <span className={styles.tableTotal}>
                                                            ₹{table.totalAmount.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>

                                                {table.orders.length > 0 && (
                                                    <div className={styles.tableOrderInfo}>
                                                        <ClipboardIcon />
                                                        <span>{table.orders.length} active order{table.orders.length > 1 ? 's' : ''}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── REQUESTS TAB ─────────────────────────────────── */}
                    {activeTab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Service Requests</h2>
                                {waiterStore.requests.filter(r => r.status === 'done').length > 0 && (
                                    <button
                                        className={styles.clearBtn}
                                        onClick={() => waiterStore.clearDoneRequests()}
                                    >
                                        Clear Done
                                    </button>
                                )}
                            </div>

                            {waiterStore.requests.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>🎉</span>
                                    <p>No pending requests</p>
                                    <span className={styles.emptySubtext}>All caught up!</span>
                                </div>
                            ) : (
                                <div className={styles.requestList}>
                                    {[...waiterStore.requests]
                                        .sort((a, b) => {
                                            // pending first, then accepted, then done
                                            const order = { pending: 0, accepted: 1, done: 2 };
                                            return order[a.status] - order[b.status] || b.timestamp - a.timestamp;
                                        })
                                        .map((req, index) => {
                                            const meta = REQUEST_META[req.type] || REQUEST_META['call-waiter'];
                                            return (
                                                <motion.div
                                                    key={req.id}
                                                    className={`${styles.requestCard} ${req.status === 'pending' ? styles.requestPending : ''} ${req.status === 'done' ? styles.requestDone : ''}`}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {req.status === 'pending' && (
                                                        <div className={styles.requestPulse} style={{ background: meta.color }} />
                                                    )}

                                                    <div className={styles.requestLeft}>
                                                        <span className={styles.requestIcon}>{meta.icon}</span>
                                                        <div className={styles.requestInfo}>
                                                            <span className={styles.requestLabel}>{meta.label}</span>
                                                            <div className={styles.requestMeta}>
                                                                <span className={styles.requestTable}>Table {req.tableNumber}</span>
                                                                <span className={styles.requestTime}>
                                                                    <ClockIcon /> {timeAgo(req.timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.requestActions}>
                                                        {req.status === 'pending' && (
                                                            <button
                                                                className={styles.acceptBtn}
                                                                onClick={() => handleAcceptRequest(req.id)}
                                                            >
                                                                Accept
                                                            </button>
                                                        )}
                                                        {req.status === 'accepted' && (
                                                            <button
                                                                className={styles.doneBtn}
                                                                onClick={() => handleCompleteRequest(req.id)}
                                                            >
                                                                <CheckIcon /> Done
                                                            </button>
                                                        )}
                                                        {req.status === 'done' && (
                                                            <span className={styles.completedLabel}>
                                                                <CheckIcon /> Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ─── ORDERS TAB ───────────────────────────────────── */}
                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Live Orders</h2>
                                <span className={styles.sectionCount}>{activeOrders.length} active</span>
                            </div>

                            {activeOrders.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>📋</span>
                                    <p>No active orders</p>
                                    <span className={styles.emptySubtext}>Waiting for new orders</span>
                                </div>
                            ) : (
                                <div className={styles.orderList}>
                                    {activeOrders.map((order, index) => {
                                        const progress = getOrderProgress(order);
                                        const allServed = isAllServed(order);
                                        const isExpanded = expandedOrder === order._id;

                                        return (
                                            <motion.div
                                                key={order._id}
                                                className={`${styles.orderCard} ${allServed ? styles.orderComplete : ''}`}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.06 }}
                                            >
                                                {/* Order Header */}
                                                <div
                                                    className={styles.orderHeader}
                                                    onClick={() => setExpandedOrder(isExpanded ? null : (order._id || null))}
                                                >
                                                    <div className={styles.orderHeaderLeft}>
                                                        <span className={styles.orderNumber}>{order.orderNumber}</span>
                                                        <span className={styles.orderTableBadge}>Table {order.tableNumber}</span>
                                                    </div>
                                                    <div className={styles.orderHeaderRight}>
                                                        <span className={styles.orderTime}>
                                                            <ClockIcon />
                                                            {order.createdAt ? timeAgo(order.createdAt) : 'N/A'}
                                                        </span>
                                                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className={styles.progressBar}>
                                                    <div
                                                        className={styles.progressFill}
                                                        style={{
                                                            width: `${progress}%`,
                                                            background: progress === 100 ? '#22c55e' : '#f97316',
                                                        }}
                                                    />
                                                </div>
                                                <span className={styles.progressLabel}>
                                                    {progress}% served {allServed && '— All Delivered ✓'}
                                                </span>

                                                {/* Order Items (always visible) */}
                                                <div className={styles.orderItems}>
                                                    {order.items.map((item) => {
                                                        const status = getResolvedItemStatus(order._id || '', item);
                                                        const statusConf = ITEM_STATUS[status] || ITEM_STATUS['pending'];

                                                        return (
                                                            <div key={item.menuItemId} className={styles.orderItem}>
                                                                <div className={styles.orderItemLeft}>
                                                                    <span className={styles.orderItemStatus}>{statusConf.icon}</span>
                                                                    <div className={styles.orderItemInfo}>
                                                                        <span className={styles.orderItemName}>
                                                                            {item.name} <span className={styles.orderItemQty}>x{item.quantity}</span>
                                                                        </span>
                                                                        <span
                                                                            className={styles.orderItemLabel}
                                                                            style={{ color: statusConf.color }}
                                                                        >
                                                                            {statusConf.label}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {status !== 'served' && (
                                                                    <button
                                                                        className={styles.advanceBtn}
                                                                        onClick={() => handleAdvanceItemStatus(order._id || '', item)}
                                                                        style={{ borderColor: statusConf.color, color: statusConf.color }}
                                                                    >
                                                                        {status === 'pending' && 'Start'}
                                                                        {status === 'preparing' && 'Ready'}
                                                                        {status === 'ready' && 'Served'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            className={styles.orderDetails}
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                        >
                                                            <div className={styles.orderBill}>
                                                                <div className={styles.billRow}>
                                                                    <span>Customer</span>
                                                                    <span>{order.customerName || '—'}</span>
                                                                </div>
                                                                <div className={styles.billRow}>
                                                                    <span>Type</span>
                                                                    <span className={styles.orderTypeBadge}>{order.type}</span>
                                                                </div>
                                                                <div className={styles.billDivider} />
                                                                <div className={styles.billRow}>
                                                                    <span>Subtotal</span>
                                                                    <span>₹{order.subtotal}</span>
                                                                </div>
                                                                <div className={styles.billRow}>
                                                                    <span>Tax (5%)</span>
                                                                    <span>₹{order.tax}</span>
                                                                </div>
                                                                <div className={styles.billRow}>
                                                                    <span>Service (10%)</span>
                                                                    <span>₹{order.serviceCharge}</span>
                                                                </div>
                                                                <div className={styles.billDivider} />
                                                                <div className={`${styles.billRow} ${styles.billTotal}`}>
                                                                    <span>Total</span>
                                                                    <span>₹{order.total}</span>
                                                                </div>
                                                            </div>

                                                            {!allServed && (
                                                                <button
                                                                    className={styles.markAllBtn}
                                                                    onClick={() => handleMarkAllServed(order)}
                                                                >
                                                                    <CheckIcon />
                                                                    Mark All Served
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ── Quick Actions ───────────────────────────────────────────── */}
            <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => showToast('Table marked for cleanup')}>
                    <span>🧹</span>
                    <span>Cleanup</span>
                </button>
                <button className={styles.quickBtn} onClick={() => router.push('/menu/01')}>
                    <span>📝</span>
                    <span>New Order</span>
                </button>
                <button className={styles.quickBtn} onClick={() => showToast('Today: 12 orders · ₹8,450 revenue')}>
                    <span>📊</span>
                    <span>Summary</span>
                </button>
            </div>

            {/* ── Toast ───────────────────────────────────────────────────── */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className={styles.toast}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 60 }}
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

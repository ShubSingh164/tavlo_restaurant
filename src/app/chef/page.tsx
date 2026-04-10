'use client';

/**
 * Tavlo Restaurant — Chef / Kitchen Display System (KDS)
 * 
 * Mobile-first interface for kitchen staff to:
 * - View incoming order queue with priority
 * - Track preparation time per order with color-coded alerts
 * - Advance item status: Pending → Preparing → Ready
 * - Mark items as "86'd" (out of stock)
 * - View today's kitchen performance stats
 * - Special instructions highlighted prominently
 * 
 * @route /chef
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaiterStore, type ItemStatusOverride } from '@/store/waiter-store';
import { useThemeStore } from '@/store/theme-store';
import { mockOrders, mockMenuItems, mockStaff, mockCategories } from '@/data/mock-data';
import type { IOrder, IOrderItem } from '@/types';
import styles from './page.module.css';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const FlameIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.6 0-8-2.4-8-7.7 0-4.2 3.4-7.7 5.5-10.3.4-.5 1.2-.2 1.2.4 0 1.5 1 3 2.3 3.8.3.2.7 0 .7-.4 0-2.1.8-4.3 2.4-5.7.4-.3 1-.1 1.1.4C18.4 7.5 20 11 20 15.3 20 20.6 15.6 23 12 23z" />
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

const ArrowLeftIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChefHatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 13.87A4 4 0 013.13 11 4 4 0 016 4a4 4 0 014-1 4 4 0 014 1 4 4 0 012.87 7 4 4 0 01-2.87 2.87" />
        <path d="M6 13.87V17a2 2 0 002 2h8a2 2 0 002-2v-3.13" />
        <line x1="8" y1="21" x2="8" y2="19" />
        <line x1="16" y1="21" x2="16" y2="19" />
        <line x1="12" y1="21" x2="12" y2="19" />
    </svg>
);

// ============================================================================
// CONSTANTS
// ============================================================================

/** Timer alert thresholds in minutes */
const TIME_WARN = 10;   // yellow after 10 min
const TIME_DANGER = 20; // red after 20 min

/** Item priority levels for sorting */
const STATUS_PRIORITY: Record<string, number> = {
    'pending': 0,
    'preparing': 1,
    'ready': 2,
    'served': 3,
};

const ITEM_STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
    'pending': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '🔴', label: 'Pending' },
    'preparing': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🟡', label: 'Preparing' },
    'ready': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: '🟢', label: 'Ready' },
    'served': { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: '✅', label: 'Served' },
};

// ============================================================================
// HELPERS
// ============================================================================

function getElapsedMinutes(timestamp: Date | number): number {
    const now = Date.now();
    const ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
    return Math.floor((now - ts) / 60000);
}

function formatTimer(minutes: number): string {
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
}

function getTimerColor(minutes: number): string {
    if (minutes >= TIME_DANGER) return '#ef4444';
    if (minutes >= TIME_WARN) return '#f59e0b';
    return '#22c55e';
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

export default function ChefDashboardPage() {
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const waiterStore = useWaiterStore();

    // UI State
    const [activeTab, setActiveTab] = useState<'queue' | 'menu' | 'stats'>('queue');
    const [isLoaded, setIsLoaded] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [outOfStockItems, setOutOfStockItems] = useState<Set<string>>(new Set());
    const [now, setNow] = useState(Date.now());

    // Current chef (Vikram Singh from mock data)
    const currentChef = mockStaff.find(s => s.role === 'chef' && s.status === 'on-duty') || mockStaff[2];

    useEffect(() => {
        setIsLoaded(true);
        // Update timers every 30s
        const interval = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

    // Toast helper
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2500);
    };

    // ─── Computed Data ────────────────────────────────────────────────────────

    // Active kitchen orders (only pending/preparing — not completed, cancelled, or served)
    const kitchenOrders = useMemo(() => {
        return mockOrders
            .filter((o) => o.status !== 'completed' && o.status !== 'cancelled')
            .sort((a, b) => {
                // Sort by timestamp (oldest first — FIFO queue)
                const aTime = a.createdAt?.getTime() || 0;
                const bTime = b.createdAt?.getTime() || 0;
                return aTime - bTime;
            });
    }, []);

    // Derive order urgency/counts
    const orderStats = useMemo(() => {
        let pendingItems = 0;
        let preparingItems = 0;
        let readyItems = 0;
        let totalItems = 0;

        kitchenOrders.forEach((order) => {
            order.items.forEach((item) => {
                const status = waiterStore.getItemStatus(order._id || '', item.menuItemId, item.status);
                totalItems++;
                if (status === 'pending') pendingItems++;
                else if (status === 'preparing') preparingItems++;
                else if (status === 'ready') readyItems++;
            });
        });

        // Avg prep time (mock: random 8-22 min)
        const avgPrepTime = kitchenOrders.length > 0 ? Math.floor(12 + Math.random() * 6) : 0;

        return { pendingItems, preparingItems, readyItems, totalItems, avgPrepTime, totalOrders: kitchenOrders.length };
    }, [kitchenOrders, waiterStore.orderOverrides, now]);

    // Menu items grouped by category (for "86" management)
    const menuByCategory = useMemo(() => {
        const groups: { categoryName: string; categoryIcon: string; items: typeof mockMenuItems }[] = [];
        mockCategories.forEach((cat) => {
            const items = mockMenuItems.filter((i) => i.categoryId === cat._id);
            if (items.length > 0) {
                groups.push({
                    categoryName: cat.name,
                    categoryIcon: cat.icon || '🍽️',
                    items,
                });
            }
        });
        return groups;
    }, []);

    // ─── Item Status Helpers ─────────────────────────────────────────────────

    const getResolvedStatus = (orderId: string, item: IOrderItem): ItemStatusOverride => {
        return waiterStore.getItemStatus(orderId, item.menuItemId, item.status);
    };

    const hasUnfinishedItems = (order: IOrder): boolean => {
        return order.items.some((item) => {
            const s = getResolvedStatus(order._id || '', item);
            return s !== 'ready' && s !== 'served';
        });
    };

    const getOrderCompletionPercent = (order: IOrder): number => {
        const total = order.items.length;
        if (total === 0) return 0;
        const done = order.items.filter((item) => {
            const s = getResolvedStatus(order._id || '', item);
            return s === 'ready' || s === 'served';
        }).length;
        return Math.round((done / total) * 100);
    };

    // ─── Actions ─────────────────────────────────────────────────────────────

    const handleStartItem = (orderId: string, item: IOrderItem) => {
        waiterStore.updateItemStatus(orderId, item.menuItemId, 'preparing');
        showToast(`Started: ${item.name}`);
    };

    const handleReadyItem = (orderId: string, item: IOrderItem) => {
        waiterStore.updateItemStatus(orderId, item.menuItemId, 'ready');
        showToast(`Ready to serve: ${item.name} ✓`);
    };

    const handleReadyAll = (order: IOrder) => {
        order.items.forEach((item) => {
            const status = getResolvedStatus(order._id || '', item);
            if (status !== 'ready' && status !== 'served') {
                waiterStore.updateItemStatus(order._id || '', item.menuItemId, 'ready');
            }
        });
        showToast(`Order ${order.orderNumber} — All items ready! 🔔`);
    };

    const handleStartAll = (order: IOrder) => {
        order.items.forEach((item) => {
            const status = getResolvedStatus(order._id || '', item);
            if (status === 'pending') {
                waiterStore.updateItemStatus(order._id || '', item.menuItemId, 'preparing');
            }
        });
        showToast(`Order ${order.orderNumber} — All items started 🔥`);
    };

    const toggle86 = useCallback((itemId: string, itemName: string) => {
        setOutOfStockItems((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
                showToast(`${itemName} — Back in stock ✓`);
            } else {
                next.add(itemId);
                showToast(`${itemName} — Marked 86'd (Out of Stock)`);
            }
            return next;
        });
    }, []);

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className={`${styles.page} ${isLoaded ? styles.loaded : ''} ${isDarkMode ? '' : styles.lightMode}`}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <ArrowLeftIcon />
                    </button>
                    <div className={styles.headerInfo}>
                        <span className={styles.greeting}>{getGreeting()} 👨‍🍳</span>
                        <h1 className={styles.chefName}>{currentChef.name}</h1>
                    </div>
                    <div className={styles.headerActions}>
                        <motion.button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </motion.button>
                        <div className={styles.liveIndicator}>
                            <span className={styles.liveDot} />
                            <span>LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={styles.statsRow}>
                    <div className={`${styles.statCard} ${styles.statPending}`}>
                        <span className={styles.statValue}>{orderStats.pendingItems}</span>
                        <span className={styles.statLabel}>Pending</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statPreparing}`}>
                        <span className={styles.statValue}>{orderStats.preparingItems}</span>
                        <span className={styles.statLabel}>Cooking</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statReady}`}>
                        <span className={styles.statValue}>{orderStats.readyItems}</span>
                        <span className={styles.statLabel}>Ready</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statAvg}`}>
                        <span className={styles.statValue}>{orderStats.avgPrepTime}m</span>
                        <span className={styles.statLabel}>Avg Time</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabBar}>
                    {(['queue', 'menu', 'stats'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'queue' && '🔥'}
                            {tab === 'menu' && '📋'}
                            {tab === 'stats' && '📊'}
                            <span>
                                {tab === 'queue' ? 'Order Queue' : tab === 'menu' ? 'Menu / 86' : 'Stats'}
                            </span>
                            {tab === 'queue' && orderStats.pendingItems > 0 && (
                                <span className={styles.tabBadge}>{orderStats.pendingItems}</span>
                            )}
                            {tab === 'menu' && outOfStockItems.size > 0 && (
                                <span className={styles.tabBadgeWarn}>{outOfStockItems.size}</span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Main Content ────────────────────────────────────────── */}
            <main className={styles.main}>
                <AnimatePresence mode="wait">

                    {/* ─── ORDER QUEUE TAB ──────────────────────────────── */}
                    {activeTab === 'queue' && (
                        <motion.div
                            key="queue"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <FlameIcon /> Kitchen Queue
                                </h2>
                                <span className={styles.sectionCount}>{orderStats.totalOrders} orders</span>
                            </div>

                            {kitchenOrders.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>🎉</span>
                                    <p>Kitchen is clear!</p>
                                    <span className={styles.emptySubtext}>No active orders right now</span>
                                </div>
                            ) : (
                                <div className={styles.orderQueue}>
                                    {kitchenOrders.map((order, index) => {
                                        const elapsed = order.createdAt ? getElapsedMinutes(order.createdAt) : 0;
                                        const timerColor = getTimerColor(elapsed);
                                        const completion = getOrderCompletionPercent(order);
                                        const allDone = !hasUnfinishedItems(order);
                                        const hasPending = order.items.some(
                                            (i) => getResolvedStatus(order._id || '', i) === 'pending'
                                        );

                                        return (
                                            <motion.div
                                                key={order._id}
                                                className={`${styles.orderTicket} ${allDone ? styles.ticketDone : ''} ${elapsed >= TIME_DANGER ? styles.ticketUrgent : ''}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.06 }}
                                            >
                                                {/* Ticket Header */}
                                                <div className={styles.ticketHeader}>
                                                    <div className={styles.ticketHeaderLeft}>
                                                        <span className={styles.ticketOrder}>{order.orderNumber}</span>
                                                        <span className={styles.ticketTable}>
                                                            Table {order.tableNumber}
                                                        </span>
                                                        <span className={styles.ticketType}>{order.type}</span>
                                                    </div>
                                                    <div className={styles.ticketTimer} style={{ color: timerColor, borderColor: timerColor }}>
                                                        <ClockIcon />
                                                        <span>{formatTimer(elapsed)}</span>
                                                    </div>
                                                </div>

                                                {/* Progress */}
                                                <div className={styles.ticketProgress}>
                                                    <div className={styles.progressTrack}>
                                                        <div
                                                            className={styles.progressFill}
                                                            style={{
                                                                width: `${completion}%`,
                                                                background: allDone ? '#22c55e' : '#f59e0b',
                                                            }}
                                                        />
                                                    </div>
                                                    <span className={styles.progressText}>{completion}%</span>
                                                </div>

                                                {/* Items */}
                                                <div className={styles.ticketItems}>
                                                    {order.items.map((item) => {
                                                        const status = getResolvedStatus(order._id || '', item);
                                                        const conf = ITEM_STATUS_CONFIG[status];
                                                        const isOOS = outOfStockItems.has(item.menuItemId);
                                                        const menuItem = mockMenuItems.find(m => m._id === item.menuItemId);

                                                        return (
                                                            <div
                                                                key={item.menuItemId}
                                                                className={`${styles.ticketItem} ${isOOS ? styles.itemOOS : ''}`}
                                                            >
                                                                <div className={styles.ticketItemLeft}>
                                                                    <span className={styles.itemStatusDot} style={{ background: conf.color }} />
                                                                    <div className={styles.itemDetails}>
                                                                        <div className={styles.itemNameRow}>
                                                                            <span className={styles.itemName}>{item.name}</span>
                                                                            <span className={styles.itemQty}>×{item.quantity}</span>
                                                                        </div>
                                                                        <div className={styles.itemMeta}>
                                                                            <span style={{ color: conf.color }}>{conf.label}</span>
                                                                            {menuItem?.preparationTime && (
                                                                                <span className={styles.prepTime}>
                                                                                    ~{menuItem.preparationTime} min
                                                                                </span>
                                                                            )}
                                                                            {menuItem?.isVegetarian && (
                                                                                <span className={styles.vegBadge}>VEG</span>
                                                                            )}
                                                                            {isOOS && (
                                                                                <span className={styles.oosBadge}>
                                                                                    <AlertTriangleIcon /> 86&apos;d
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {item.specialInstructions && (
                                                                            <div className={styles.specialNote}>
                                                                                📝 {item.specialInstructions}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className={styles.ticketItemActions}>
                                                                    {status === 'pending' && (
                                                                        <button
                                                                            className={styles.startBtn}
                                                                            onClick={() => handleStartItem(order._id || '', item)}
                                                                        >
                                                                            Start
                                                                        </button>
                                                                    )}
                                                                    {status === 'preparing' && (
                                                                        <button
                                                                            className={styles.readyBtn}
                                                                            onClick={() => handleReadyItem(order._id || '', item)}
                                                                        >
                                                                            <CheckIcon /> Ready
                                                                        </button>
                                                                    )}
                                                                    {status === 'ready' && (
                                                                        <span className={styles.readyLabel}>
                                                                            <CheckIcon /> Done
                                                                        </span>
                                                                    )}
                                                                    {status === 'served' && (
                                                                        <span className={styles.servedLabel}>Served</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Ticket Footer Actions */}
                                                <div className={styles.ticketFooter}>
                                                    {hasPending && (
                                                        <button
                                                            className={styles.startAllBtn}
                                                            onClick={() => handleStartAll(order)}
                                                        >
                                                            🔥 Start All
                                                        </button>
                                                    )}
                                                    {!allDone && (
                                                        <button
                                                            className={styles.readyAllBtn}
                                                            onClick={() => handleReadyAll(order)}
                                                        >
                                                            ✅ All Ready
                                                        </button>
                                                    )}
                                                    {allDone && (
                                                        <span className={styles.ticketComplete}>
                                                            ✅ Complete — Awaiting Pickup
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

                    {/* ─── MENU / 86 TAB ────────────────────────────────── */}
                    {activeTab === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Menu Availability</h2>
                                {outOfStockItems.size > 0 && (
                                    <span className={styles.oosCount}>{outOfStockItems.size} item(s) 86&apos;d</span>
                                )}
                            </div>

                            <p className={styles.menuHint}>
                                Toggle items off to mark as &ldquo;86&apos;d&rdquo; (out of stock). This prevents new orders for those items.
                            </p>

                            <div className={styles.menuCategories}>
                                {menuByCategory.map((group) => (
                                    <div key={group.categoryName} className={styles.menuCategory}>
                                        <h3 className={styles.catHeader}>
                                            <span>{group.categoryIcon}</span>
                                            <span>{group.categoryName}</span>
                                        </h3>
                                        <div className={styles.menuItemList}>
                                            {group.items.map((item) => {
                                                const isOOS = outOfStockItems.has(item._id || '');
                                                return (
                                                    <div
                                                        key={item._id}
                                                        className={`${styles.menuCard} ${isOOS ? styles.menuCardOOS : ''}`}
                                                    >
                                                        <div className={styles.menuCardLeft}>
                                                            <div className={styles.menuCardInfo}>
                                                                <span className={styles.menuCardName}>
                                                                    {item.isVegetarian && <span className={styles.vegDot}>●</span>}
                                                                    {item.name}
                                                                </span>
                                                                <span className={styles.menuCardPrice}>₹{item.price}</span>
                                                            </div>
                                                            <div className={styles.menuCardMeta}>
                                                                <span>~{item.preparationTime} min</span>
                                                                {item.spiceLevel && (
                                                                    <span className={styles.spiceBadge}>
                                                                        {item.spiceLevel === 'hot' || item.spiceLevel === 'extra-hot' ? '🌶️' : ''}
                                                                        {item.spiceLevel}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className={`${styles.toggleBtn} ${isOOS ? styles.toggleOff : styles.toggleOn}`}
                                                            onClick={() => toggle86(item._id || '', item.name)}
                                                        >
                                                            <div className={styles.toggleKnob} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── STATS TAB ────────────────────────────────────── */}
                    {activeTab === 'stats' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={styles.tabContent}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Today&apos;s Kitchen Performance</h2>
                            </div>

                            {/* Performance metrics */}
                            <div className={styles.perfGrid}>
                                <div className={styles.perfCard}>
                                    <span className={styles.perfIcon}>📦</span>
                                    <span className={styles.perfValue}>{currentChef.ordersHandled}</span>
                                    <span className={styles.perfLabel}>Orders Completed</span>
                                </div>
                                <div className={styles.perfCard}>
                                    <span className={styles.perfIcon}>⏱️</span>
                                    <span className={styles.perfValue}>{orderStats.avgPrepTime}m</span>
                                    <span className={styles.perfLabel}>Avg Prep Time</span>
                                </div>
                                <div className={styles.perfCard}>
                                    <span className={styles.perfIcon}>⭐</span>
                                    <span className={styles.perfValue}>{currentChef.rating}</span>
                                    <span className={styles.perfLabel}>Kitchen Rating</span>
                                </div>
                                <div className={styles.perfCard}>
                                    <span className={styles.perfIcon}>🔥</span>
                                    <span className={styles.perfValue}>{orderStats.totalOrders}</span>
                                    <span className={styles.perfLabel}>In Queue Now</span>
                                </div>
                            </div>

                            {/* Top Items Today */}
                            <div className={styles.topSection}>
                                <h3 className={styles.topTitle}>🏆 Most Ordered Items</h3>
                                <div className={styles.topList}>
                                    {[
                                        { name: 'Hyderabadi Biryani', count: 24, trend: '+12%' },
                                        { name: 'Butter Chicken', count: 19, trend: '+8%' },
                                        { name: 'Paneer Tikka', count: 15, trend: '+5%' },
                                        { name: 'Dal Makhani', count: 12, trend: '-2%' },
                                        { name: 'Gulab Jamun', count: 11, trend: '+15%' },
                                    ].map((item, i) => (
                                        <div key={item.name} className={styles.topItem}>
                                            <span className={styles.topRank}>#{i + 1}</span>
                                            <span className={styles.topName}>{item.name}</span>
                                            <span className={styles.topCount}>{item.count} orders</span>
                                            <span className={`${styles.topTrend} ${item.trend.startsWith('+') ? styles.trendUp : styles.trendDown}`}>
                                                {item.trend}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preparation time chart (mock visual bar chart) */}
                            <div className={styles.topSection}>
                                <h3 className={styles.topTitle}>⏱️ Prep Time by Category</h3>
                                <div className={styles.barChart}>
                                    {[
                                        { name: 'Starters', time: 15, max: 30 },
                                        { name: 'Main Course', time: 25, max: 30 },
                                        { name: 'Rice & Biryani', time: 28, max: 30 },
                                        { name: 'Breads', time: 8, max: 30 },
                                        { name: 'Beverages', time: 5, max: 30 },
                                        { name: 'Desserts', time: 5, max: 30 },
                                    ].map((cat) => (
                                        <div key={cat.name} className={styles.barRow}>
                                            <span className={styles.barLabel}>{cat.name}</span>
                                            <div className={styles.barTrack}>
                                                <motion.div
                                                    className={styles.barFill}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(cat.time / cat.max) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 }}
                                                    style={{
                                                        background: cat.time > 20 ? '#f59e0b' : '#22c55e',
                                                    }}
                                                />
                                            </div>
                                            <span className={styles.barValue}>{cat.time}m</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kitchen team */}
                            <div className={styles.topSection}>
                                <h3 className={styles.topTitle}>👥 Kitchen Team On Duty</h3>
                                <div className={styles.teamGrid}>
                                    {mockStaff
                                        .filter(s => s.role === 'chef' && s.status === 'on-duty')
                                        .map((chef) => (
                                            <div key={chef._id} className={styles.teamCard}>
                                                <img
                                                    src={chef.avatar}
                                                    alt={chef.name}
                                                    className={styles.teamAvatar}
                                                />
                                                <span className={styles.teamName}>{chef.firstName}</span>
                                                <span className={styles.teamRole}>Chef</span>
                                                <div className={styles.teamStat}>
                                                    <span>⭐ {chef.rating}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ── Toast ───────────────────────────────────────────────── */}
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

'use client';

/**
 * Tavlo Restaurant ERP - Orders Page
 * 
 * Full orders management page with filtering, search, and actions.
 * 
 * @component OrdersPage
 * @route /orders
 * @backend Fetches orders with filters and pagination
 * @api GET /api/orders - Fetch orders with query params
 * @api PATCH /api/orders/:id/status - Update order status
 * @api DELETE /api/orders/:id - Delete order
 */

import React, { useState } from 'react';

import { KpiCard, OrdersTable, StatusTabs } from '@/components/dashboard';
import { mockDashboardMetrics, mockOrders } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
    </svg>
);

/**
 * Orders page component
 * Displays all orders with filtering and management capabilities
 */
export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState('all');

    // Filter orders based on active tab
    const filteredOrders = mockOrders.filter((order) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'ongoing') return order.status === 'preparing' || order.status === 'pending' || order.status === 'confirmed';
        return order.status === activeTab;
    });

    // Count orders by status
    const orderCounts = {
        all: mockOrders.length,
        completed: mockOrders.filter((o) => o.status === 'completed').length,
        ongoing: mockOrders.filter((o) => ['preparing', 'pending', 'confirmed'].includes(o.status)).length,
        cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
    };

    const tabs = [
        { id: 'completed', label: 'Completed', count: orderCounts.completed, color: 'success' as const },
        { id: 'ongoing', label: 'Ongoing', count: orderCounts.ongoing, color: 'warning' as const },
        { id: 'cancelled', label: 'Cancelled', count: orderCounts.cancelled, color: 'error' as const },
    ];

    /**
     * Handle order view
     * @backend Open order details modal or navigate to order details page
     */
    const handleViewOrder = (order: typeof mockOrders[0]) => {
        console.log('View order:', order);
        // TODO: Implement order details modal
    };

    /**
     * Handle order deletion
     * @backend Call DELETE /api/orders/:id and refresh list
     */
    const handleDeleteOrder = (orderId: string) => {
        console.log('Delete order:', orderId);
        // TODO: Show confirmation modal and delete via API
    };

    return (
        
            <div className={styles.ordersPage}>
                {/* Overview Section */}
                <section className={styles.overviewSection}>
                    <h2 className={styles.sectionTitle}>Overview</h2>

                    <div className={styles.kpiGrid}>
                        <KpiCard
                            label="Today's Revenue"
                            value={formatCurrency(mockDashboardMetrics.todayRevenue)}
                            change={mockDashboardMetrics.todayRevenueChange}
                            changeLabel="Today"
                            icon={<InfoIcon />}
                            variant="primary"
                        />
                        <KpiCard
                            label="Month's Revenue"
                            value={formatCurrency(mockDashboardMetrics.monthRevenue)}
                            change={mockDashboardMetrics.monthRevenueChange}
                            changeLabel="Orders in Kitchen"
                            icon={<InfoIcon />}
                        />
                        <KpiCard
                            label="Order Count"
                            value={`${mockDashboardMetrics.orderCount}`}
                            change={mockDashboardMetrics.orderCountChange}
                            changeLabel="This Month"
                            icon={<InfoIcon />}
                        />
                        <KpiCard
                            label="Fiscal Year Revenue"
                            value={formatCurrency(mockDashboardMetrics.fiscalYearRevenue)}
                            change={mockDashboardMetrics.fiscalYearChange}
                            changeLabel="This Month"
                            icon={<InfoIcon />}
                        />
                    </div>
                </section>

                {/* Orders Table Section */}
                <section className={styles.tableSection}>
                    <div className={styles.tableSectionHeader}>
                        <StatusTabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />
                        <button className={styles.viewAnalyticsBtn}>
                            View Analytics →
                        </button>
                    </div>

                    <OrdersTable
                        orders={filteredOrders}
                        onView={handleViewOrder}
                        onDelete={handleDeleteOrder}
                    />
                </section>
            </div>
        
    );
}

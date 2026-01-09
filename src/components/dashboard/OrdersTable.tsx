'use client';

/**
 * Tavlo Restaurant ERP - Orders Table Component
 * 
 * Displays orders in a tabular format with filtering and actions.
 * Used in the Orders page.
 * 
 * @component OrdersTable
 * @backend Fetches orders from API
 * @api GET /api/orders - Fetch orders with filters
 * @api PATCH /api/orders/:id - Update order status
 * @api DELETE /api/orders/:id - Delete order
 */

import React, { useState } from 'react';
import { IOrder } from '@/types';
import { formatCurrency, formatDate, formatTime, getOrderStatusClass, getOrderStatusText } from '@/lib/utils';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
    orders: IOrder[];
    onStatusChange?: (orderId: string, newStatus: string) => void;
    onView?: (order: IOrder) => void;
    onDelete?: (orderId: string) => void;
}

// Icon components
const MoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);

const CreditCardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

/**
 * OrdersTable - displays orders in a data table with actions
 */
export default function OrdersTable({
    orders,
    onStatusChange,
    onView,
    onDelete,
}: OrdersTableProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (orderId: string) => {
        setActiveDropdown(activeDropdown === orderId ? null : orderId);
    };

    const handleAction = (action: string, order: IOrder) => {
        setActiveDropdown(null);
        switch (action) {
            case 'view':
                onView?.(order);
                break;
            case 'delete':
                onDelete?.(order._id || '');
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Bill No.</th>
                        <th>Date & Time</th>
                        <th>Table No.</th>
                        <th>Customer Name</th>
                        <th>Amount</th>
                        <th>Order Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td className={styles.billNo}>{order.billNumber || order.orderNumber}</td>
                            <td className={styles.dateTime}>
                                <span className={styles.date}>{formatDate(order.createdAt || new Date())}</span>
                                <span className={styles.time}>{formatTime(order.createdAt || new Date())}</span>
                            </td>
                            <td>#{order.tableNumber || '-'}</td>
                            <td>{order.customerName || 'Guest'}</td>
                            <td className={styles.amount}>
                                {order.total ? formatCurrency(order.total) : '-'}
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                    {getOrderStatusText(order.status)}
                                </span>
                            </td>
                            <td>
                                <div className={styles.actionWrapper}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => toggleDropdown(order._id || '')}
                                        aria-label="Order actions"
                                    >
                                        <MoreIcon />
                                    </button>

                                    {activeDropdown === order._id && (
                                        <div className={styles.actionDropdown}>
                                            <button
                                                className={styles.dropdownItem}
                                                onClick={() => handleAction('view', order)}
                                            >
                                                <EyeIcon />
                                                <span>Preview</span>
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <DownloadIcon />
                                                <span>Download</span>
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <CreditCardIcon />
                                                <span>Mode of Payment</span>
                                            </button>
                                            <button
                                                className={`${styles.dropdownItem} ${styles.danger}`}
                                                onClick={() => handleAction('delete', order)}
                                            >
                                                <TrashIcon />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {orders.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No orders found</p>
                </div>
            )}
        </div>
    );
}

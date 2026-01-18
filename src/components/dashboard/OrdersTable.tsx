'use client';

/**
 * Tavlo Restaurant ERP - Orders Table Component
 * 
 * Displays orders in a tabular format with filtering and actions.
 * Used in the Orders page.
 * 
 * @component OrdersTable
 */

import React, { useState } from 'react';
import { IOrder } from '@/types';
import { formatCurrency, formatDate, formatTime, getOrderStatusText } from '@/lib/utils';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
    orders: IOrder[];
    onStatusChange?: (orderId: string, newStatus: string) => void;
    onView?: (order: IOrder) => void;
    onDelete?: (orderId: string) => void;
    onOrdersChange?: (orders: IOrder[]) => void;
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

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

/**
 * OrdersTable - displays orders in a data table with actions
 */
export default function OrdersTable({
    orders,
    onView,
    onDelete,
    onOrdersChange,
}: OrdersTableProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [previewOrder, setPreviewOrder] = useState<IOrder | null>(null);
    const [paymentOrder, setPaymentOrder] = useState<IOrder | null>(null);
    const [deleteOrder, setDeleteOrder] = useState<IOrder | null>(null);
    const [localOrders, setLocalOrders] = useState(orders);

    // Sync local orders with prop changes
    React.useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    const toggleDropdown = (orderId: string) => {
        setActiveDropdown(activeDropdown === orderId ? null : orderId);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeDropdown]);

    const handlePreview = (order: IOrder) => {
        setActiveDropdown(null);
        setPreviewOrder(order);
        onView?.(order);
    };

    const handleDownload = (order: IOrder) => {
        setActiveDropdown(null);
        const receiptContent = `
TAVLO RESTAURANT
================================
Order: ${order.orderNumber}
Bill No: ${order.billNumber || order.orderNumber}
Date: ${formatDate(order.createdAt || new Date())}
Time: ${formatTime(order.createdAt || new Date())}
--------------------------------
Customer: ${order.customerName || 'Guest'}
Table: ${order.tableNumber || 'N/A'}
--------------------------------
ITEMS:
${order.items?.map(item => `${item.name} x${item.quantity}   ${formatCurrency(item.subtotal)}`).join('\n') || 'No items'}
--------------------------------
Subtotal: ${formatCurrency(order.subtotal || 0)}
Tax: ${formatCurrency(order.tax || 0)}
TOTAL: ${formatCurrency(order.total || 0)}
================================
Payment: ${order.paymentMethod?.toUpperCase() || 'PENDING'}
        `.trim();
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${order.orderNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleModeOfPayment = (order: IOrder) => {
        setActiveDropdown(null);
        setPaymentOrder(order);
    };

    const updatePaymentMethod = (method: 'cash' | 'card' | 'upi' | 'wallet') => {
        if (!paymentOrder) return;
        const updatedOrders = localOrders.map(o =>
            o._id === paymentOrder._id
                ? { ...o, paymentMethod: method, paymentStatus: 'paid' as const }
                : o
        );
        setLocalOrders(updatedOrders);
        onOrdersChange?.(updatedOrders);
        setPaymentOrder(null);
    };

    const handleDelete = (order: IOrder) => {
        setActiveDropdown(null);
        setDeleteOrder(order);
    };

    const confirmDelete = () => {
        if (!deleteOrder) return;
        const updatedOrders = localOrders.filter(o => o._id !== deleteOrder._id);
        setLocalOrders(updatedOrders);
        onOrdersChange?.(updatedOrders);
        onDelete?.(deleteOrder._id || '');
        setDeleteOrder(null);
    };

    // Render dropdown menu
    const renderDropdown = (order: IOrder, isNearBottom: boolean) => (
        <div
            className={`${styles.actionDropdown} ${isNearBottom ? styles.dropdownUp : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <button className={styles.dropdownItem} onClick={() => handlePreview(order)}>
                <EyeIcon />
                <span>Preview</span>
            </button>
            <button className={styles.dropdownItem} onClick={() => handleDownload(order)}>
                <DownloadIcon />
                <span>Download</span>
            </button>
            <button className={styles.dropdownItem} onClick={() => handleModeOfPayment(order)}>
                <CreditCardIcon />
                <span>Mode of Payment</span>
            </button>
            <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => handleDelete(order)}>
                <TrashIcon />
                <span>Delete</span>
            </button>
        </div>
    );

    return (
        <div className={styles.tableContainer}>
            {/* Desktop Table View */}
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
                    {localOrders.map((order, index) => {
                        const isNearBottom = index >= localOrders.length - 3;
                        return (
                            <tr key={order._id}>
                                <td className={styles.billNo}>{order.billNumber || order.orderNumber}</td>
                                <td className={styles.dateTime}>
                                    <span className={styles.date}>{formatDate(order.createdAt || new Date())}</span>
                                    <span className={styles.time}>{formatTime(order.createdAt || new Date())}</span>
                                </td>
                                <td>#{order.tableNumber || '-'}</td>
                                <td>{order.customerName || 'Guest'}</td>
                                <td className={styles.amount}>{order.total ? formatCurrency(order.total) : '-'}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                        {getOrderStatusText(order.status)}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionWrapper}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={(e) => { e.stopPropagation(); toggleDropdown(order._id || ''); }}
                                            aria-label="Order actions"
                                        >
                                            <MoreIcon />
                                        </button>
                                        {activeDropdown === order._id && renderDropdown(order, isNearBottom)}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Mobile Card View */}
            <div className={styles.mobileCards}>
                {localOrders.map((order, index) => {
                    const isNearBottom = index >= localOrders.length - 3;
                    return (
                        <div key={order._id} className={styles.mobileCard}>
                            <div className={styles.mobileCardHeader}>
                                <div className={styles.mobileCardTitleRow}>
                                    <span className={styles.billNo}>{order.billNumber || order.orderNumber}</span>
                                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                                        {getOrderStatusText(order.status)}
                                    </span>
                                </div>
                                <div className={styles.mobileCardTime}>
                                    <span className={styles.date}>{formatDate(order.createdAt || new Date())}</span>
                                    <span className={styles.time}>{formatTime(order.createdAt || new Date())}</span>
                                </div>
                            </div>
                            <div className={styles.mobileCardBody}>
                                <div className={styles.mobileCardItem}>
                                    <span className={styles.mobileCardLabel}>Customer</span>
                                    <span className={styles.mobileCardValue}>{order.customerName || 'Guest'}</span>
                                </div>
                                <div className={styles.mobileCardItem}>
                                    <span className={styles.mobileCardLabel}>Table</span>
                                    <span className={styles.mobileCardValue}>#{order.tableNumber || '-'}</span>
                                </div>
                            </div>
                            <div className={styles.mobileCardFooter}>
                                <span className={styles.mobileCardTotal}>{order.total ? formatCurrency(order.total) : '-'}</span>
                                <div className={styles.actionWrapper}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => { e.stopPropagation(); toggleDropdown(order._id || ''); }}
                                        aria-label="Order actions"
                                    >
                                        <MoreIcon />
                                    </button>
                                    {activeDropdown === order._id && renderDropdown(order, isNearBottom)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {localOrders.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No orders found</p>
                </div>
            )}

            {/* Preview Modal */}
            {previewOrder && (
                <div className={styles.modalOverlay} onClick={() => setPreviewOrder(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Order Details</h3>
                            <button className={styles.modalClose} onClick={() => setPreviewOrder(null)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.orderInfo}>
                                <div className={styles.orderInfoRow}>
                                    <span className={styles.orderInfoLabel}>Order Number</span>
                                    <span className={styles.orderInfoValue}>{previewOrder.orderNumber}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                    <span className={styles.orderInfoLabel}>Bill Number</span>
                                    <span className={styles.orderInfoValue}>{previewOrder.billNumber || '-'}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                    <span className={styles.orderInfoLabel}>Customer</span>
                                    <span className={styles.orderInfoValue}>{previewOrder.customerName || 'Guest'}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                    <span className={styles.orderInfoLabel}>Table</span>
                                    <span className={styles.orderInfoValue}>#{previewOrder.tableNumber || 'N/A'}</span>
                                </div>
                                <div className={styles.orderInfoRow}>
                                    <span className={styles.orderInfoLabel}>Status</span>
                                    <span className={`${styles.statusBadge} ${styles[previewOrder.status]}`}>
                                        {getOrderStatusText(previewOrder.status)}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.orderItems}>
                                <h4>Items</h4>
                                {previewOrder.items?.length > 0 ? (
                                    <ul className={styles.itemsList}>
                                        {previewOrder.items.map((item, idx) => (
                                            <li key={idx} className={styles.itemRow}>
                                                <span className={styles.itemName}>{item.name} × {item.quantity}</span>
                                                <span className={styles.itemPrice}>{formatCurrency(item.subtotal)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={styles.noItems}>No items</p>
                                )}
                            </div>
                            <div className={styles.orderTotals}>
                                <div className={styles.totalRow}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(previewOrder.subtotal || 0)}</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Tax</span>
                                    <span>{formatCurrency(previewOrder.tax || 0)}</span>
                                </div>
                                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                    <span>Total</span>
                                    <span>{formatCurrency(previewOrder.total || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method Modal */}
            {paymentOrder && (
                <div className={styles.modalOverlay} onClick={() => setPaymentOrder(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Mode of Payment</h3>
                            <button className={styles.modalClose} onClick={() => setPaymentOrder(null)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.paymentModalText}>
                                Select payment for order <strong>{paymentOrder.orderNumber}</strong>
                            </p>
                            <p className={styles.paymentModalAmount}>
                                Amount: <strong>{formatCurrency(paymentOrder.total || 0)}</strong>
                            </p>
                            <div className={styles.paymentOptions}>
                                <button className={`${styles.paymentOption} ${paymentOrder.paymentMethod === 'cash' ? styles.selected : ''}`} onClick={() => updatePaymentMethod('cash')}>
                                    <span className={styles.paymentIcon}>💵</span><span>Cash</span>
                                </button>
                                <button className={`${styles.paymentOption} ${paymentOrder.paymentMethod === 'card' ? styles.selected : ''}`} onClick={() => updatePaymentMethod('card')}>
                                    <span className={styles.paymentIcon}>💳</span><span>Card</span>
                                </button>
                                <button className={`${styles.paymentOption} ${paymentOrder.paymentMethod === 'upi' ? styles.selected : ''}`} onClick={() => updatePaymentMethod('upi')}>
                                    <span className={styles.paymentIcon}>📱</span><span>UPI</span>
                                </button>
                                <button className={`${styles.paymentOption} ${paymentOrder.paymentMethod === 'wallet' ? styles.selected : ''}`} onClick={() => updatePaymentMethod('wallet')}>
                                    <span className={styles.paymentIcon}>👛</span><span>Wallet</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteOrder && (
                <div className={styles.modalOverlay} onClick={() => setDeleteOrder(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Delete Order</h3>
                            <button className={styles.modalClose} onClick={() => setDeleteOrder(null)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.deleteWarning}>
                                <span className={styles.warningIcon}>⚠️</span>
                                <p>Are you sure you want to delete order <strong>{deleteOrder.orderNumber}</strong>?</p>
                                <p className={styles.warningSubtext}>This action cannot be undone.</p>
                            </div>
                            <div className={styles.deleteActions}>
                                <button className={styles.cancelBtn} onClick={() => setDeleteOrder(null)}>Cancel</button>
                                <button className={styles.deleteBtn} onClick={confirmDelete}>Delete Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

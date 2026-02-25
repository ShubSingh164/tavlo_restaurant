'use client';

/**
 * Tavlo - Dedicated Cart Page
 * 
 * Full-page cart with:
 * - Item list with thumbnails
 * - Quantity stepper controls
 * - Remove item button
 * - Promo code input
 * - Order summary
 * - Checkout button
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { useThemeStore } from '@/store/theme-store';
import styles from './page.module.css';

// Icons
const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MinusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const EmptyCartIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
);

export default function CartPage() {
    const router = useRouter();
    const cartStore = useCartStore();
    const { isDarkMode } = useThemeStore();
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const items = cartStore.items;
    const subtotal = cartStore.getSubtotal();
    const tax = cartStore.getTax();
    const total = cartStore.getTotal();

    const handleApplyPromo = () => {
        if (promoCode.trim()) {
            setPromoApplied(true);
            // Mock promo - in real app would validate against backend
        }
    };

    const handleCheckout = () => {
        // Navigate to checkout or show success
        router.push('/menu/table-1'); // For now, go back to menu
        // In real app: router.push('/checkout')
    };

    return (
        <div className={`${styles.page} ${isDarkMode ? styles.dark : ''}`}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <BackIcon />
                </button>
                <h1>My Cart</h1>
                <div className={styles.headerSpacer} />
            </header>

            {/* Cart Content */}
            <div className={styles.content}>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <EmptyCartIcon />
                        <h2>Your cart is empty</h2>
                        <p>Add some delicious items to get started!</p>
                        <button
                            className={styles.browseBtn}
                            onClick={() => router.push('/menu/table-1')}
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Item List */}
                        <div className={styles.itemList}>
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.menuItemId}
                                        className={styles.cartItem}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        layout
                                    >
                                        <div className={styles.itemImage}>
                                            <img src={item.image} alt={item.name} />
                                        </div>

                                        <div className={styles.itemDetails}>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            {item.modifiers && item.modifiers.length > 0 && (
                                                <p className={styles.itemModifiers}>
                                                    {item.modifiers.map(m => m.name).join(', ')}
                                                </p>
                                            )}
                                            <span className={styles.itemPrice}>₹{item.price}</span>
                                        </div>

                                        <div className={styles.itemActions}>
                                            {/* Quantity Stepper */}
                                            <div className={styles.stepper}>
                                                <button
                                                    className={styles.stepperBtn}
                                                    onClick={() => cartStore.updateQuantity(item.menuItemId, item.quantity - 1)}
                                                >
                                                    <MinusIcon />
                                                </button>
                                                <span className={styles.stepperValue}>{item.quantity}</span>
                                                <button
                                                    className={`${styles.stepperBtn} ${styles.stepperPlus}`}
                                                    onClick={() => cartStore.updateQuantity(item.menuItemId, item.quantity + 1)}
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => cartStore.removeItem(item.menuItemId)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Promo Code */}
                        <div className={styles.promoSection}>
                            <div className={styles.promoInput}>
                                <TagIcon />
                                <input
                                    type="text"
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    disabled={promoApplied}
                                />
                            </div>
                            <button
                                className={`${styles.promoBtn} ${promoApplied ? styles.applied : ''}`}
                                onClick={handleApplyPromo}
                                disabled={promoApplied || !promoCode.trim()}
                            >
                                {promoApplied ? 'Applied' : 'Apply'}
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className={styles.summary}>
                            <h3>Order Summary</h3>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax (5% GST)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            {promoApplied && (
                                <div className={`${styles.summaryRow} ${styles.discount}`}>
                                    <span>Promo Discount</span>
                                    <span>-₹0.00</span>
                                </div>
                            )}
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Fixed Checkout Footer */}
            {items.length > 0 && (
                <div className={styles.footer}>
                    <motion.button
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>Checkout</span>
                        <span className={styles.checkoutTotal}>₹{total.toFixed(2)}</span>
                    </motion.button>
                </div>
            )}
        </div>
    );
}

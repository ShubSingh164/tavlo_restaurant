'use client';

/**
 * Tavlo - Bottom Sheet Cart Component
 * 
 * Slide-up drawer for cart and checkout flow.
 * Keeps customer in context of menu while managing cart.
 */

import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { useCartStore, CartItem } from '@/store/cart-store';
import styles from './BottomSheetCart.module.css';

// Icons
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

interface BottomSheetCartProps {
    isOpen: boolean;
    onClose: () => void;
    onPlaceOrder: () => void;
}

export default function BottomSheetCart({ isOpen, onClose, onPlaceOrder }: BottomSheetCartProps) {
    const cartStore = useCartStore();
    const dragControls = useDragControls();

    const subtotal = cartStore.getSubtotal();
    const tax = cartStore.getTax();
    const serviceCharge = Math.round(subtotal * 0.10);
    const total = subtotal + tax + serviceCharge;

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.velocity.y > 500 || info.offset.y > 200) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        className={styles.sheet}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        drag="y"
                        dragControls={dragControls}
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Drag Handle */}
                        <div className={styles.handle} onPointerDown={(e) => dragControls.start(e)}>
                            <div className={styles.handleBar} />
                        </div>

                        {/* Header */}
                        <div className={styles.header}>
                            <h2>Your Order</h2>
                            <span className={styles.itemCount}>{cartStore.getItemCount()} items</span>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className={styles.content}>
                            {cartStore.items.length === 0 ? (
                                <div className={styles.emptyCart}>
                                    <span className={styles.emptyIcon}>🛒</span>
                                    <p>Your cart is empty</p>
                                    <button onClick={onClose}>Browse Menu</button>
                                </div>
                            ) : (
                                <div className={styles.itemList}>
                                    {cartStore.items.map((item: CartItem) => (
                                        <motion.div
                                            key={item.menuItemId}
                                            className={styles.cartItem}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <img src={item.image} alt={item.name} className={styles.itemImage} />
                                            <div className={styles.itemInfo}>
                                                <h4>{item.name}</h4>
                                                {item.modifiers && item.modifiers.length > 0 && (
                                                    <span className={styles.modifiers}>
                                                        {item.modifiers.map(m => m.name).join(', ')}
                                                    </span>
                                                )}
                                                <span className={styles.itemPrice}>₹{item.price}</span>
                                            </div>
                                            <div className={styles.quantityControls}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => cartStore.updateQuantity(item.menuItemId, item.quantity - 1)}
                                                >
                                                    {item.quantity === 1 ? <TrashIcon /> : <MinusIcon />}
                                                </button>
                                                <span className={styles.qty}>{item.quantity}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => cartStore.updateQuantity(item.menuItemId, item.quantity + 1)}
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {cartStore.items.length > 0 && (
                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>GST (5%)</span>
                                    <span>₹{tax}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Service Charge (10%)</span>
                                    <span>₹{serviceCharge}</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>

                                <motion.button
                                    className={styles.placeOrderBtn}
                                    onClick={onPlaceOrder}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Place Order • ₹{total}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

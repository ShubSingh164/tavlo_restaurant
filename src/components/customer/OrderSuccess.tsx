'use client';

/**
 * Tavlo - Order Success Component
 * 
 * Confirmation screen with animation showing order sent to kitchen.
 */

import { motion } from 'framer-motion';
import styles from './OrderSuccess.module.css';

// Animated checkmark SVG
const CheckmarkIcon = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <motion.circle
            cx="30"
            cy="30"
            r="28"
            stroke="#22c55e"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
            d="M18 30L26 38L42 22"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        />
    </svg>
);

// Kitchen icon
const KitchenIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="6" cy="14" r="1" fill="#f97316" />
        <circle cx="12" cy="14" r="1" fill="#f97316" />
        <circle cx="18" cy="14" r="1" fill="#f97316" />
        <path d="M10 4V2M14 4V2" />
    </svg>
);

interface OrderSuccessProps {
    orderNumber: string;
    onContinue: () => void;
}

export default function OrderSuccess({ orderNumber, onContinue }: OrderSuccessProps) {
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className={styles.content}>
                {/* Success Icon */}
                <motion.div
                    className={styles.successIcon}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                >
                    <CheckmarkIcon />
                </motion.div>

                {/* Title */}
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Order Placed!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Your order has been sent to the kitchen
                </motion.p>

                {/* Order Number Card */}
                <motion.div
                    className={styles.orderCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className={styles.orderLabel}>Order Number</span>
                    <span className={styles.orderNumber}>{orderNumber}</span>
                </motion.div>

                {/* Kitchen Animation */}
                <motion.div
                    className={styles.kitchenStatus}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className={styles.kitchenIcon}>
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        >
                            <KitchenIcon />
                        </motion.div>
                    </div>
                    <div className={styles.statusDots}>
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        />
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        />
                        <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        />
                    </div>
                    <span className={styles.statusText}>Preparing your order...</span>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                    className={styles.continueBtn}
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Back to Menu
                </motion.button>
            </div>
        </motion.div>
    );
}

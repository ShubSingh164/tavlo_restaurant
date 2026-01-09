'use client';

/**
 * Tavlo Restaurant ERP - Food Card Component
 * 
 * Displays a menu item with image, name, price, and rating.
 * Used in menu management and customer menu views.
 * 
 * @component FoodCard
 * @backend Menu item data from API
 * @api GET /api/menu - Fetch menu items
 */

import React from 'react';
import { IMenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import styles from './FoodCard.module.css';

interface FoodCardProps {
    item: IMenuItem;
    onEdit?: (item: IMenuItem) => void;
    onDelete?: (itemId: string) => void;
    onAddToCart?: (item: IMenuItem) => void;
    showActions?: boolean;
    variant?: 'admin' | 'customer';
}

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

/**
 * FoodCard - displays a menu item card
 */
export default function FoodCard({
    item,
    onEdit,
    onDelete,
    onAddToCart,
    showActions = true,
    variant = 'admin',
}: FoodCardProps) {
    const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;

    return (
        <div className={styles.foodCard}>
            {/* Image */}
            <div className={styles.imageWrapper}>
                <img
                    src={item.images[0] || '/placeholder-food.jpg'}
                    alt={item.name}
                    className={styles.image}
                />

                {/* Badges */}
                <div className={styles.badges}>
                    {item.isVegetarian && (
                        <span className={`${styles.badge} ${styles.veg}`}>Veg</span>
                    )}
                    {item.isPopular && (
                        <span className={`${styles.badge} ${styles.popular}`}>Bestseller</span>
                    )}
                    {hasDiscount && (
                        <span className={`${styles.badge} ${styles.discount}`}>
                            {Math.round(((item.price - (item.discountedPrice || 0)) / item.price) * 100)}% OFF
                        </span>
                    )}
                </div>

                {/* Admin Actions Overlay */}
                {variant === 'admin' && showActions && (
                    <div className={styles.actionsOverlay}>
                        <button
                            className={styles.actionBtn}
                            onClick={() => onEdit?.(item)}
                            aria-label="Edit item"
                        >
                            <EditIcon />
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete?.(item._id || '')}
                            aria-label="Delete item"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.title}>{item.name}</h3>

                <p className={styles.description}>
                    {item.shortDescription || item.description}
                </p>

                <div className={styles.footer}>
                    <div className={styles.priceSection}>
                        <span className={styles.price}>
                            {formatCurrency(item.discountedPrice || item.price)}
                        </span>
                        {hasDiscount && (
                            <span className={styles.originalPrice}>
                                {formatCurrency(item.price)}
                            </span>
                        )}
                    </div>

                    <div className={styles.ratingSection}>
                        <span className={styles.rating}>
                            <StarIcon />
                            {item.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Add to Cart (Customer variant) */}
                {variant === 'customer' && (
                    <button
                        className={styles.addToCartBtn}
                        onClick={() => onAddToCart?.(item)}
                        disabled={!item.isAvailable}
                    >
                        <PlusIcon />
                        <span>{item.isAvailable ? 'Add' : 'Unavailable'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}

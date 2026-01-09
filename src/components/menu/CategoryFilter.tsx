'use client';

/**
 * Tavlo Restaurant ERP - Category Filter Component
 * 
 * Horizontal scrollable category filter with icons.
 * Used in menu pages for filtering by category.
 * 
 * @component CategoryFilter
 * @backend Fetches categories from API
 * @api GET /api/categories - Fetch all categories
 */

import React from 'react';
import { ICategory } from '@/types';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
    categories: ICategory[];
    selectedCategory: string | null;
    onSelect: (categoryId: string | null) => void;
}

/**
 * CategoryFilter - horizontal category pills with images
 */
export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelect,
}: CategoryFilterProps) {
    return (
        <div className={styles.categoryFilter}>
            {/* All Items */}
            <button
                className={`${styles.categoryPill} ${selectedCategory === null ? styles.active : ''}`}
                onClick={() => onSelect(null)}
            >
                <div className={styles.iconWrapper}>
                    <span className={styles.iconEmoji}>🍽️</span>
                </div>
                <span className={styles.name}>All Items</span>
                <span className={styles.indicator} />
            </button>

            {/* Category Pills */}
            {categories.map((category) => (
                <button
                    key={category._id}
                    className={`${styles.categoryPill} ${selectedCategory === category._id ? styles.active : ''}`}
                    onClick={() => onSelect(category._id || null)}
                >
                    <div className={styles.iconWrapper}>
                        {category.image ? (
                            <img src={category.image} alt={category.name} className={styles.iconImage} />
                        ) : (
                            <span className={styles.iconEmoji}>{category.icon}</span>
                        )}
                    </div>
                    <span className={styles.name}>{category.name}</span>
                    <span className={styles.indicator} />
                </button>
            ))}
        </div>
    );
}

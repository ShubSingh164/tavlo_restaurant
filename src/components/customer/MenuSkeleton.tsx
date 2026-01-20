'use client';

/**
 * Tavlo - Menu Skeleton Loader
 * 
 * Branded skeleton loading state matching the card design.
 */

import styles from './MenuSkeleton.module.css';

export default function MenuSkeleton() {
    return (
        <div className={styles.container}>
            {/* Hero Skeleton */}
            <div className={styles.heroSkeleton}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTag} />
                    <div className={styles.heroTitle} />
                    <div className={styles.heroSubtitle} />
                    <div className={styles.heroBtn} />
                </div>
            </div>

            {/* Categories Skeleton */}
            <div className={styles.categorySkeleton}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.categoryPill} />
                ))}
            </div>

            {/* Recommended Section Skeleton */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle} />
                    <div className={styles.sectionLink} />
                </div>
                <div className={styles.cardScroll}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.foodCard}>
                            <div className={styles.cardImage} />
                            <div className={styles.cardInfo}>
                                <div className={styles.cardName} />
                                <div className={styles.cardDesc} />
                                <div className={styles.cardFooter}>
                                    <div className={styles.cardPrice} />
                                    <div className={styles.cardRating} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu List Skeleton */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle} />
                    <div className={styles.itemCount} />
                </div>
                <div className={styles.menuList}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={styles.menuItem}>
                            <div className={styles.menuImage} />
                            <div className={styles.menuInfo}>
                                <div className={styles.menuName} />
                                <div className={styles.menuDesc} />
                                <div className={styles.menuMeta}>
                                    <div className={styles.metaPill} />
                                    <div className={styles.metaPill} />
                                </div>
                                <div className={styles.menuPrice} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

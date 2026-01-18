'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css';

/**
 * Tavlo Restaurant - Customer Menu Page
 * 
 * Dynamic route for table-specific menu viewing.
 * Customers scan QR code at their table to access this page.
 * 
 * @route /menu/[tableId]
 */

export default function CustomerMenuPage() {
    const params = useParams();
    const tableId = params.tableId as string;

    return (
        <div className={styles.menuPage}>
            <header className={styles.header}>
                <div className={styles.logoWrapper}>
                    <h1 className={styles.logo}>tavlo</h1>
                </div>
                <div className={styles.tableInfo}>
                    <span className={styles.tableLabel}>Table</span>
                    <span className={styles.tableNumber}>{tableId}</span>
                </div>
            </header>

            <main className={styles.main}>
                <section className={styles.welcomeSection}>
                    <h2 className={styles.welcomeTitle}>Welcome!</h2>
                    <p className={styles.welcomeText}>
                        Browse our menu and place your order. A staff member will assist you shortly.
                    </p>
                </section>

                <section className={styles.categoriesSection}>
                    <h3 className={styles.sectionTitle}>Categories</h3>
                    <div className={styles.categoryGrid}>
                        {['Starters', 'Main Course', 'Desserts', 'Beverages'].map((category) => (
                            <div key={category} className={styles.categoryCard}>
                                <span className={styles.categoryName}>{category}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.menuSection}>
                    <h3 className={styles.sectionTitle}>Popular Items</h3>
                    <p className={styles.placeholder}>
                        Menu items will be loaded here based on restaurant configuration.
                    </p>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>Powered by Tavlo</p>
            </footer>
        </div>
    );
}

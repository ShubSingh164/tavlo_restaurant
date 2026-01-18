'use client';

/**
 * Tavlo Restaurant ERP - Menu Management Page
 * 
 * Admin page for managing menu items: view, add, edit, delete dishes.
 * Includes category filtering and search functionality.
 * 
 * @component MenuPage
 * @route /menu
 * @backend CRUD operations on menu items
 * @api GET /api/menu - Fetch menu items with filters
 * @api POST /api/menu - Create new menu item
 * @api PUT /api/menu/:id - Update menu item
 * @api DELETE /api/menu/:id - Delete menu item
 * @api GET /api/categories - Fetch categories
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { FoodCard, CategoryFilter } from '@/components/menu';
import { mockMenuItems, mockCategories } from '@/data/mock-data';
import { matchesSearch } from '@/lib/utils';
import { IMenuItem } from '@/types';
import styles from './page.module.css';

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

/**
 * Menu management page component
 */
export default function MenuPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuItems, setMenuItems] = useState<IMenuItem[]>(mockMenuItems);

    // Load new items from localStorage on mount
    useEffect(() => {
        const storedItems = localStorage.getItem('newMenuItems');
        if (storedItems) {
            try {
                const newItems = JSON.parse(storedItems) as IMenuItem[];
                // Combine mock items with new items (new items first)
                setMenuItems([...newItems.reverse(), ...mockMenuItems]);
            } catch (e) {
                console.error('Failed to parse stored menu items:', e);
            }
        }
    }, []);

    /**
     * Filter menu items based on category and search
     * @backend Replace with API call: GET /api/menu?category=X&search=Y
     */
    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
            // Category filter
            if (selectedCategory && item.categoryId !== selectedCategory) {
                return false;
            }
            // Search filter
            if (searchQuery && !matchesSearch(item, searchQuery)) {
                return false;
            }
            return true;
        });
    }, [menuItems, selectedCategory, searchQuery]);

    /**
     * Handle adding a new menu item
     * Navigate to add item page
     */
    const handleAddItem = () => {
        router.push('/menu/add');
    };

    /**
     * Handle editing a menu item
     * Navigate to the edit dish page
     */
    const handleEditItem = (item: IMenuItem) => {
        router.push(`/menu/edit/${item._id}`);
    };

    /**
     * Handle deleting a menu item
     */
    const handleDeleteItem = (itemId: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            // Remove from state
            setMenuItems(prev => prev.filter(item => item._id !== itemId));

            // Also remove from localStorage if it was a newly added item
            const storedItems = localStorage.getItem('newMenuItems');
            if (storedItems) {
                try {
                    const newItems = JSON.parse(storedItems) as IMenuItem[];
                    const updatedItems = newItems.filter(item => item._id !== itemId);
                    localStorage.setItem('newMenuItems', JSON.stringify(updatedItems));
                } catch (e) {
                    console.error('Failed to update stored menu items:', e);
                }
            }
        }
    };

    return (
        <AdminLayout title="Menu">
            <div className={styles.menuPage}>
                {/* Header Section */}
                <section className={styles.headerSection}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.sectionTitle}>Menu Items</h2>
                        <span className={styles.itemCount}>{filteredItems.length} items</span>
                    </div>

                    <div className={styles.headerRight}>
                        {/* Search */}
                        <div className={styles.searchInput}>
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <button className={styles.addBtn} onClick={handleAddItem}>
                            <PlusIcon />
                            <span>Add Item</span>
                        </button>
                    </div>
                </section>

                {/* Category Filter */}
                <section className={styles.categorySection}>
                    <CategoryFilter
                        categories={mockCategories}
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </section>

                {/* Menu Grid */}
                <section className={styles.menuGrid}>
                    {filteredItems.map((item) => (
                        <FoodCard
                            key={item._id}
                            item={item}
                            variant="admin"
                            showActions={true}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                        />
                    ))}

                    {filteredItems.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No menu items found</p>
                            <button className={styles.addBtn} onClick={handleAddItem}>
                                <PlusIcon />
                                <span>Add Your First Item</span>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

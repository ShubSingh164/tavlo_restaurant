'use client';

/**
 * Tavlo Restaurant - Premium Customer Menu Web App
 * 
 * Design inspired by modern food delivery apps with:
 * - Glassmorphic navigation and headers
 * - Orange accent color (#f97316)
 * - Framer Motion animations
 * - Bottom Sheet Cart
 * - QR Scanner with pulse effect
 * - Skeleton loading states
 * - Responsive split-view
 * 
 * @route /menu/[tableId]
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { IMenuItem, ICategory } from '@/types';
import QRScanner from '@/components/customer/QRScanner';
import BottomSheetCart from '@/components/customer/BottomSheetCart';
import MenuSkeleton from '@/components/customer/MenuSkeleton';
import OrderSuccess from '@/components/customer/OrderSuccess';
import styles from './page.module.css';

// ============================================================================
// TYPES
// ============================================================================

interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    extras?: { name: string; price: number }[];
}

interface ExtraOption {
    id: string;
    name: string;
    price: number;
    selected: boolean;
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
);

const SunIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const WaiterIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a3 3 0 100 6 3 3 0 000-6zM7 10.5c0-.28.22-.5.5-.5h9c.28 0 .5.22.5.5v.5a5 5 0 01-10 0v-.5z" />
        <path d="M5 22v-3a2 2 0 012-2h10a2 2 0 012 2v3" />
    </svg>
);

const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.5"}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        {!active && <polyline points="9 22 9 12 15 12 15 22" />}
    </svg>
);

const OrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
    </svg>
);

const ScanQRIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3z" />
        <path d="M17 17h4v4h-4z" />
        <path d="M14 17v4" />
        <path d="M17 14h4" />
    </svg>
);

const NotificationIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const ProfileIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const FireIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 23c-3.866 0-7-2.686-7-6 0-1.732.585-3.333 1.5-4.5.417-.533.917-1.033 1.5-1.5-.25 1.5-.25 3 1 4.5.5-1.5 1.5-2.5 2.5-3.5 1.5-1.5 2.5-3 2.5-5 0 1.5 1 2.5 2 3.5s2 2 2 3.5c.915 1.167 1.5 2.768 1.5 4.5 0 3.314-3.134 6-7 6z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CustomerMenuPage() {
    const params = useParams();
    const router = useRouter();
    const tableId = params.tableId as string;

    // Zustand cart store
    const cartStore = useCartStore();

    // API Data State
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [activeCategory, setActiveCategory] = useState('all');
    const [showCart, setShowCart] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
    const [itemQuantity, setItemQuantity] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeNav, setActiveNav] = useState('home');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [extras, setExtras] = useState<ExtraOption[]>([
        { id: '1', name: 'Extra Cheese', price: 30, selected: false },
        { id: '2', name: 'Spicy', price: 0, selected: false },
        { id: '3', name: 'Extra Sauce', price: 20, selected: false },
    ]);
    const [specialNotes, setSpecialNotes] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch menu data from API
    const fetchMenuData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/menu');
            const data = await response.json();

            if (data.success) {
                setMenuItems(data.data.items);
                setCategories(data.data.categories);
            } else {
                setError('Failed to load menu');
            }
        } catch {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
            setIsLoaded(true);
        }
    }, []);

    // Initialize
    useEffect(() => {
        fetchMenuData();
        cartStore.setTableId(tableId);
    }, [fetchMenuData, tableId]);

    // Focus search input when shown
    useEffect(() => {
        if (searchQuery && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchQuery]);

    // Reset extras when item changes
    useEffect(() => {
        if (selectedItem) {
            setExtras([
                { id: '1', name: 'Extra Cheese', price: 30, selected: false },
                { id: '2', name: 'Spicy', price: 0, selected: false },
                { id: '3', name: 'Extra Sauce', price: 20, selected: false },
            ]);
            setSpecialNotes('');
            setItemQuantity(1);
        }
    }, [selectedItem]);

    // Filter items
    const filteredItems = useMemo(() => {
        let items = menuItems.filter((item: IMenuItem) => item.isAvailable);

        if (activeCategory !== 'all') {
            items = items.filter((item: IMenuItem) => item.categoryId === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter((item: IMenuItem) =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }

        return items;
    }, [menuItems, activeCategory, searchQuery]);

    // Get recommended items
    const recommendedItems = useMemo(() => {
        return menuItems.filter((item: IMenuItem) => item.isPopular && item.isAvailable).slice(0, 6);
    }, [menuItems]);

    // Cart operations - using Zustand store
    const addToCart = (item: IMenuItem, quantity: number = 1, selectedExtras?: ExtraOption[]) => {
        const extrasPrice = selectedExtras?.filter(e => e.selected).reduce((sum, e) => sum + e.price, 0) || 0;
        const itemPrice = (item.discountedPrice || item.price) + extrasPrice;

        // Use Zustand store
        const modifiers = selectedExtras?.filter(e => e.selected).map(e => ({ name: e.name, price: e.price }));
        cartStore.addItem({
            menuItemId: item._id || '',
            name: item.name,
            price: itemPrice,
            image: item.images[0],
            modifiers,
        });

        // If adding more than 1, update quantity
        if (quantity > 1) {
            cartStore.updateQuantity(item._id || '', quantity);
        }
    };

    const updateCartQuantity = (menuItemId: string, delta: number) => {
        const currentQty = cartStore.items.find(i => i.menuItemId === menuItemId)?.quantity || 0;
        cartStore.updateQuantity(menuItemId, currentQty + delta);
    };

    // Get quantity of an item in cart
    const getCartItemQty = (itemId: string): number => {
        const cartItem = cartStore.items.find(c => c.menuItemId === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const cartItemCount = cartStore.getItemCount();

    const cartTotal = useMemo(() => {
        const subtotal = cartStore.getSubtotal();
        const tax = cartStore.getTax();
        const serviceCharge = Math.round(subtotal * 0.10);
        return {
            subtotal,
            tax,
            serviceCharge,
            total: subtotal + tax + serviceCharge,
        };
    }, [cartStore.items]);

    const handleAddFromModal = () => {
        if (selectedItem) {
            addToCart(selectedItem, itemQuantity, extras);
            setSelectedItem(null);
        }
    };

    const handlePlaceOrder = () => {
        const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
        setOrderNumber(orderNum);
        setOrderPlaced(true);
        setShowCart(false);
        cartStore.clearCart();
    };

    const toggleFavorite = (itemId: string) => {
        setFavorites(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleExtra = (extraId: string) => {
        setExtras(prev =>
            prev.map(e =>
                e.id === extraId ? { ...e, selected: !e.selected } : e
            )
        );
    };

    const getModalTotal = () => {
        if (!selectedItem) return 0;
        const basePrice = selectedItem.discountedPrice || selectedItem.price;
        const extrasPrice = extras.filter(e => e.selected).reduce((sum, e) => sum + e.price, 0);
        return (basePrice + extrasPrice) * itemQuantity;
    };

    // Category icons mapping
    const getCategoryIcon = (name: string) => {
        const icons: Record<string, string> = {
            'Starters': '🍜',
            'Main Course': '🍛',
            'Soups & Salads': '🥗',
            'Rice & Biryani': '🍚',
            'Breads & Rotis': '🫓',
            'Beverages': '🥤',
            'Desserts': '🍰',
        };
        return icons[name] || '🍽️';
    };

    return (
        <div className={`${styles.app} ${isLoaded ? styles.loaded : ''} ${isDarkMode ? styles.darkMode : ''}`}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <span className={styles.greeting}>Good Evening 👋</span>
                        <h1 className={styles.headerTitle}>Table {tableId}</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <motion.button
                            className={styles.themeToggle}
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </motion.button>
                        <button className={styles.bellBtn}>
                            <BellIcon />
                            <span className={styles.notiBadge}>2</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className={styles.searchBar}>
                    <SearchIcon />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button className={styles.filterBtn}>
                        <FilterIcon />
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                {/* Hero Section - Modern Clean Design */}
                <section className={styles.heroSection}>
                    <div className={styles.heroCard}>
                        <div className={styles.heroLeft}>
                            <span className={styles.heroLabel}>Today&apos;s Special</span>
                            <h2 className={styles.heroTitle}>Discover our Chef&apos;s Signature Dishes</h2>
                            <p className={styles.heroDesc}>Fresh ingredients, authentic flavors</p>
                            <motion.button
                                className={styles.heroBtn}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Explore Menu
                            </motion.button>
                        </div>
                        <div className={styles.heroRight}>
                            <div className={styles.heroImageWrapper}>
                                <img
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                                    alt="Featured dish"
                                    className={styles.heroImage}
                                />
                                <div className={styles.heroBadge}>
                                    <span>🔥</span>
                                    <span>-30%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className={styles.categoriesSection}>
                    <div className={styles.categoryScroll}>
                        <button
                            className={`${styles.categoryPill} ${activeCategory === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            <span className={styles.categoryIcon}>🍽️</span>
                            <span className={styles.categoryName}>All</span>
                        </button>
                        {categories.map((cat: ICategory) => (
                            <button
                                key={cat._id}
                                className={`${styles.categoryPill} ${activeCategory === cat._id ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat._id === activeCategory ? 'all' : cat._id || 'all')}
                            >
                                <span className={styles.categoryIcon}>{getCategoryIcon(cat.name)}</span>
                                <span className={styles.categoryName}>{cat.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Recommended Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recommended For You</h2>
                        <button className={styles.seeAllBtn}>See All</button>
                    </div>
                    <div className={styles.recommendedScroll}>
                        {recommendedItems.map((item, index) => (
                            <div
                                key={item._id}
                                className={styles.foodCard}
                                onClick={() => setSelectedItem(item)}
                                style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
                            >
                                <div className={styles.cardImageWrapper}>
                                    <img src={item.images[0]} alt={item.name} className={styles.cardImage} />
                                    <button
                                        className={styles.addCardBtn}
                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.cardName}>{item.name}</h3>
                                    <p className={styles.cardDesc}>{item.shortDescription}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardPrice}>₹{item.discountedPrice || item.price}</span>
                                        <span className={styles.cardRating}>
                                            <StarIcon /> {item.rating || '4.5'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Menu Grid */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            {activeCategory === 'all' ? 'All Dishes' : categories.find((c: ICategory) => c._id === activeCategory)?.name || 'Menu'}
                        </h2>
                        <span className={styles.itemCount}>{filteredItems.length} items</span>
                    </div>
                    <div className={styles.menuList}>
                        {filteredItems.map((item, index) => (
                            <div
                                key={item._id}
                                className={styles.menuItem}
                                onClick={() => router.push(`/dish/${item._id}`)}
                                style={{ '--index': index } as React.CSSProperties}
                            >
                                <div className={styles.menuItemImage}>
                                    <img src={item.images[0]} alt={item.name} />
                                    {item.discountedPrice && (
                                        <span className={styles.listDiscountBadge}>
                                            {Math.round((1 - item.discountedPrice / item.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className={styles.menuItemInfo}>
                                    <h3 className={styles.menuItemName}>{item.name}</h3>
                                    <p className={styles.menuItemDesc}>{item.shortDescription}</p>

                                    <div className={styles.menuItemMeta}>
                                        <span className={`${styles.metaPill} ${styles.ratingPill}`}>
                                            <StarIcon /> {item.rating || '4.5'}
                                        </span>
                                        <span className={`${styles.metaPill} ${styles.timePill}`}>
                                            <ClockIcon /> {item.preparationTime || '15'}m
                                        </span>
                                    </div>

                                    <div className={styles.menuItemFooter}>
                                        <span className={styles.menuItemPrice}>₹{item.discountedPrice || item.price}</span>

                                        {/* Quantity Toggle */}
                                        {getCartItemQty(item._id || '') > 0 ? (
                                            <div className={styles.qtyToggle} onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={(e) => { e.stopPropagation(); updateCartQuantity(item._id || '', -1); }}
                                                >
                                                    <MinusIcon />
                                                </button>
                                                <span className={styles.qtyValue}>{getCartItemQty(item._id || '')}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={styles.addBtn}
                                                onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                            >
                                                ADD
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🍽️</span>
                            <p>No dishes found</p>
                            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Bottom Navigation - 4 Node Design with Center QR */}
            <nav className={styles.bottomNav}>
                <button
                    className={`${styles.navItem} ${activeNav === 'home' ? styles.active : ''}`}
                    onClick={() => setActiveNav('home')}
                >
                    <HomeIcon active={activeNav === 'home'} />
                    <span>Menu</span>
                </button>

                <button
                    className={`${styles.navItem} ${activeNav === 'waiter' ? styles.active : ''}`}
                    onClick={() => setActiveNav('waiter')}
                >
                    <WaiterIcon />
                    <span>Waiter</span>
                </button>

                {/* Center QR Scanner Button */}
                <motion.button
                    className={styles.qrNavBtn}
                    onClick={() => setShowQRScanner(true)}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={styles.qrNavInner}>
                        <ScanQRIcon />
                    </div>
                </motion.button>

                <button
                    className={`${styles.navItem} ${activeNav === 'orders' ? styles.active : ''}`}
                    onClick={() => setActiveNav('orders')}
                >
                    <OrdersIcon />
                    <span>Orders</span>
                </button>

                <button
                    className={`${styles.navItem} ${activeNav === 'profile' ? styles.active : ''}`}
                    onClick={() => router.push('/profile')}
                >
                    <ProfileIcon />
                    <span>Profile</span>
                </button>
            </nav>

            {/* QR Scanner Modal */}
            {showQRScanner && (
                <QRScanner />
            )}

            {/* View Cart Button - Professional Design */}
            {cartItemCount > 0 && !showCart && (
                <button className={styles.viewCartBtn} onClick={() => setShowCart(true)}>
                    <div className={styles.cartLeft}>
                        <span className={styles.cartCount}>{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</span>
                        <span className={styles.cartAmount}>₹{cartTotal.total}</span>
                    </div>
                    <div className={styles.cartRight}>
                        <span>View Cart</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            )}

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
                    <div className={styles.itemModal} onClick={e => e.stopPropagation()}>
                        {/* Hero Image */}
                        <div className={styles.modalHero}>
                            <img src={selectedItem.images[0]} alt={selectedItem.name} />
                            <button className={styles.modalBackBtn} onClick={() => setSelectedItem(null)}>
                                <BackIcon />
                            </button>
                            <button
                                className={styles.modalHeartBtn}
                                onClick={() => toggleFavorite(selectedItem._id || '')}
                            >
                                <HeartIcon filled={favorites.includes(selectedItem._id || '')} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Title & Quantity */}
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>{selectedItem.name}</h2>
                                <div className={styles.quantityControl}>
                                    <button
                                        onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                                        disabled={itemQuantity <= 1}
                                    >
                                        <MinusIcon />
                                    </button>
                                    <span>{itemQuantity}</span>
                                    <button onClick={() => setItemQuantity(itemQuantity + 1)}>
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className={styles.modalMeta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Ratings</span>
                                    <span className={styles.metaValue}>
                                        <StarIcon /> {selectedItem.rating || '4.8'}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Time</span>
                                    <span className={styles.metaValue}>
                                        <ClockIcon /> {selectedItem.preparationTime || '12'} min
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Calories</span>
                                    <span className={styles.metaValue}>
                                        <FireIcon /> {selectedItem.calories || '145'} kcal
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className={styles.modalDesc}>
                                {selectedItem.description}
                                <button className={styles.readMore}>Read More</button>
                            </p>

                            {/* Add Extras */}
                            <div className={styles.extrasSection}>
                                <h3 className={styles.extrasTitle}>Add Extra Additional</h3>
                                {extras.map(extra => (
                                    <div
                                        key={extra.id}
                                        className={styles.extraItem}
                                        onClick={() => toggleExtra(extra.id)}
                                    >
                                        <div className={`${styles.checkbox} ${extra.selected ? styles.checked : ''}`}>
                                            {extra.selected && <CheckIcon />}
                                        </div>
                                        <span className={styles.extraName}>{extra.name}</span>
                                        <span className={styles.extraPrice}>
                                            {extra.price > 0 ? `₹${extra.price}` : 'Free'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Add Notes */}
                            <div className={styles.notesSection}>
                                <h3 className={styles.notesTitle}>Add Notes</h3>
                                <input
                                    type="text"
                                    placeholder="Write Notes..."
                                    value={specialNotes}
                                    onChange={(e) => setSpecialNotes(e.target.value)}
                                    className={styles.notesInput}
                                />
                            </div>
                        </div>

                        {/* Modal Footer Button */}
                        <button className={styles.modalAddBtn} onClick={handleAddFromModal}>
                            <span>Next</span>
                            <span className={styles.modalDivider} />
                            <span>₹{getModalTotal()}</span>
                        </button>
                    </div>
                </div>
            )}


            {/* Bottom Sheet Cart */}
            <BottomSheetCart
                isOpen={showCart}
                onClose={() => setShowCart(false)}
                onPlaceOrder={handlePlaceOrder}
            />

            {/* Legacy Cart Drawer - Kept for reference */}
            {false && showCart && (
                <div className={styles.drawerOverlay} onClick={() => setShowCart(false)}>
                    <div className={styles.cartDrawer} onClick={e => e.stopPropagation()}>
                        <div className={styles.drawerHeader}>
                            <button onClick={() => setShowCart(false)}>
                                <BackIcon />
                            </button>
                            <h2>Details Transaction</h2>
                            <div style={{ width: 24 }} />
                        </div>

                        {cartStore.items.length === 0 ? (
                            <div className={styles.emptyCart}>
                                <span>🛒</span>
                                <p>Your cart is empty</p>
                                <button onClick={() => setShowCart(false)}>Browse Menu</button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.cartItems}>
                                    {cartStore.items.map((item) => (
                                        <div key={item.menuItemId} className={styles.cartItem}>
                                            <img src={item.image} alt={item.name} />
                                            <div className={styles.cartItemInfo}>
                                                <h4>{item.name}</h4>
                                                <span className={styles.cartItemQty}>
                                                    {item.quantity}x {item.name}
                                                </span>
                                                {item.modifiers && item.modifiers.map((mod, i: number) => (
                                                    <span key={i} className={styles.cartItemExtra}>
                                                        {item.quantity}x {mod.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className={styles.cartItemPrices}>
                                                <span>₹{item.price * item.quantity}</span>
                                                {item.modifiers && item.modifiers.map((mod, i: number) => (
                                                    <span key={i}>₹{mod.price * item.quantity}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Promo Code */}
                                <div className={styles.promoCode}>
                                    <span className={styles.promoIcon}>🎟️</span>
                                    <span>Promo Code</span>
                                    <button className={styles.applyBtn}>Apply</button>
                                </div>

                                {/* Order Summary */}
                                <div className={styles.orderSummary}>
                                    <h3>Order Summary</h3>
                                    <div className={styles.summaryRow}>
                                        <span>Food Total</span>
                                        <span>₹{cartTotal.subtotal}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Delivery</span>
                                        <span>₹{cartTotal.serviceCharge}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Discount</span>
                                        <span>-₹0</span>
                                    </div>
                                    <div className={`${styles.summaryRow} ${styles.total}`}>
                                        <span>Total Payment</span>
                                        <span>₹{cartTotal.total}</span>
                                    </div>
                                </div>

                                <button className={styles.processOrderBtn} onClick={handlePlaceOrder}>
                                    Process Order
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}


            {/* Order Success Screen with Animation */}
            <AnimatePresence>
                {orderPlaced && (
                    <OrderSuccess
                        orderNumber={orderNumber}
                        onContinue={() => setOrderPlaced(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

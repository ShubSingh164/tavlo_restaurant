'use client';

/**
 * Tavlo - Dish Description & Customization Page
 * 
 * High-conversion product page with:
 * - Hero image with glassmorphic controls
 * - Sticky scroll header
 * - Size selection + add-ons
 * - Real-time price updates
 * - Nutritional info toggle
 * - "Goes well with" upsell rail
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import styles from './page.module.css';

// Types
interface SizeOption {
    id: string;
    name: string;
    price: number;
}

interface AddOn {
    id: string;
    name: string;
    price: number;
    image: string;
    selected: boolean;
}

interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface DishData {
    id: string;
    name: string;
    description: string;
    image: string;
    basePrice: number;
    rating: number;
    reviewCount: number;
    spiceLevel: number;
    isVeg: boolean;
    prepTime: string;
    ingredients: string[];
    chefsNote: string;
    sizes: SizeOption[];
    addOns: AddOn[];
    nutritionalInfo: NutritionalInfo;
    goesWellWith: { id: string; name: string; image: string; price: number }[];
}

// Icons
const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ChiliIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
    </svg>
);

const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const InfoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MinusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// Mock dish data
const mockDish: DishData = {
    id: 'dish-1',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces cooked in a rich, creamy tomato-based sauce with aromatic spices. A North Indian classic loved worldwide.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    basePrice: 349,
    rating: 4.8,
    reviewCount: 234,
    spiceLevel: 2,
    isVeg: false,
    prepTime: '20-25 min',
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Garam Masala', 'Kasuri Methi'],
    chefsNote: 'Our signature recipe uses farm-fresh cream and slow-cooked tomatoes to create the perfect balance of richness and tang. Best enjoyed with hot butter naan!',
    sizes: [
        { id: 'half', name: 'Half', price: 0 },
        { id: 'full', name: 'Full', price: 150 },
        { id: 'family', name: 'Family Pack', price: 350 },
    ],
    addOns: [
        { id: 'extra-gravy', name: 'Extra Gravy', price: 40, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop', selected: false },
        { id: 'butter-naan', name: 'Butter Naan', price: 45, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop', selected: false },
        { id: 'raita', name: 'Raita', price: 35, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=100&h=100&fit=crop', selected: false },
        { id: 'salad', name: 'Green Salad', price: 50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop', selected: false },
    ],
    nutritionalInfo: {
        calories: 450,
        protein: 32,
        carbs: 18,
        fat: 28,
    },
    goesWellWith: [
        { id: 'lassi', name: 'Mango Lassi', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=150&h=150&fit=crop', price: 89 },
        { id: 'gulab', name: 'Gulab Jamun', image: 'https://images.unsplash.com/photo-1666190094665-2515bbf21eaa?w=150&h=150&fit=crop', price: 99 },
        { id: 'jeera', name: 'Jeera Rice', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=150&h=150&fit=crop', price: 129 },
    ],
};

export default function DishDetailPage() {
    const params = useParams();
    const router = useRouter();
    const cartStore = useCartStore();
    const dishId = params.id as string;

    // State
    const [dish, setDish] = useState<DishData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showNutrition, setShowNutrition] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Fetch dish data
    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setDish(mockDish);
            setAddOns(mockDish.addOns);
            setIsLoading(false);
        }, 500);
    }, [dishId]);

    // Scroll detection for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 280);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle add-on selection
    const toggleAddOn = useCallback((id: string) => {
        setAddOns(prev => prev.map(addon =>
            addon.id === id ? { ...addon, selected: !addon.selected } : addon
        ));
    }, []);

    // Calculate total price
    const calculatePrice = useCallback(() => {
        if (!dish) return 0;

        let total = dish.basePrice;

        // Add size price
        if (selectedSize) {
            const size = dish.sizes.find(s => s.id === selectedSize);
            if (size) total += size.price;
        }

        // Add selected add-ons
        const addOnTotal = addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
        total += addOnTotal;

        return total * quantity;
    }, [dish, selectedSize, addOns, quantity]);

    // Add to cart
    const handleAddToCart = () => {
        if (!dish || !selectedSize) return;

        const selectedAddOns = addOns.filter(a => a.selected);
        const itemId = `${dish.id}-${selectedSize}-${Date.now()}`;

        // Add item to cart (starts with quantity 1)
        cartStore.addItem({
            menuItemId: itemId,
            name: `${dish.name} (${dish.sizes.find(s => s.id === selectedSize)?.name})`,
            price: calculatePrice() / quantity,
            image: dish.image,
            modifiers: selectedAddOns.map(a => ({ name: a.name, price: a.price })),
            specialInstructions: specialInstructions || undefined,
        });

        // Update to correct quantity
        if (quantity > 1) {
            cartStore.updateQuantity(itemId, quantity);
        }

        router.back();
    };

    if (isLoading || !dish) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading dish details...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Hero Image Section */}
            <div className={styles.hero}>
                <img src={dish.image} alt={dish.name} className={styles.heroImage} />
                <div className={styles.heroOverlay} />

                {/* Glassmorphic Controls */}
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <BackIcon />
                </button>
                <button
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.favorited : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <HeartIcon filled={isFavorite} />
                </button>

                {/* Veg/Non-veg Badge */}
                <div className={`${styles.vegBadge} ${dish.isVeg ? styles.veg : styles.nonVeg}`}>
                    <span className={styles.vegDot} />
                    {dish.isVeg ? 'Veg' : 'Non-Veg'}
                </div>
            </div>

            {/* Sticky Header */}
            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        className={styles.stickyHeader}
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                    >
                        <button className={styles.stickyBack} onClick={() => router.back()}>
                            <BackIcon />
                        </button>
                        <div className={styles.stickyInfo}>
                            <h3>{dish.name}</h3>
                            <span>₹{calculatePrice()}</span>
                        </div>
                        <div className={styles.stickyRating}>
                            <StarIcon />
                            <span>{dish.rating}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className={styles.content}>
                {/* Title Area */}
                <div className={styles.titleArea}>
                    <div className={styles.titleHeader}>
                        <h1>{dish.name}</h1>
                        <div className={styles.priceTag}>₹{dish.basePrice}</div>
                    </div>

                    <div className={styles.metaRow}>
                        <div className={styles.rating}>
                            <StarIcon />
                            <span>{dish.rating}</span>
                            <span className={styles.reviewCount}>({dish.reviewCount} reviews)</span>
                        </div>
                        <div className={styles.prepTime}>
                            <ClockIcon />
                            <span>{dish.prepTime}</span>
                        </div>
                        <div className={styles.spiceLevel}>
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={i < dish.spiceLevel ? styles.spiceActive : styles.spiceInactive}>
                                    <ChiliIcon />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className={styles.descSection}>
                    <p className={styles.description}>{dish.description}</p>

                    {/* Ingredients */}
                    <div className={styles.ingredients}>
                        <h4>Ingredients</h4>
                        <div className={styles.ingredientTags}>
                            {dish.ingredients.map((ing, i) => (
                                <span key={i} className={styles.ingredientTag}>{ing}</span>
                            ))}
                        </div>
                    </div>

                    {/* Chef's Note */}
                    <div className={styles.chefsNote}>
                        <h4>👨‍🍳 Chef&apos;s Note</h4>
                        <p>{dish.chefsNote}</p>
                    </div>
                </div>

                {/* Size Selection (Mandatory) */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Select Size</h3>
                        <span className={styles.required}>Required</span>
                    </div>
                    <div className={styles.sizeOptions}>
                        {dish.sizes.map((size) => (
                            <motion.button
                                key={size.id}
                                className={`${styles.sizeOption} ${selectedSize === size.id ? styles.selected : ''}`}
                                onClick={() => setSelectedSize(size.id)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={styles.sizeRadio}>
                                    {selectedSize === size.id && <div className={styles.sizeRadioInner} />}
                                </div>
                                <span className={styles.sizeName}>{size.name}</span>
                                <span className={styles.sizePrice}>
                                    {size.price > 0 ? `+₹${size.price}` : 'Base'}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Add-ons */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Add-ons</h3>
                        <span className={styles.optional}>Optional</span>
                    </div>
                    <div className={styles.addOnsGrid}>
                        {addOns.map((addon) => (
                            <motion.button
                                key={addon.id}
                                className={`${styles.addOnCard} ${addon.selected ? styles.selected : ''}`}
                                onClick={() => toggleAddOn(addon.id)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src={addon.image} alt={addon.name} className={styles.addOnImage} />
                                <div className={styles.addOnInfo}>
                                    <span className={styles.addOnName}>{addon.name}</span>
                                    <span className={styles.addOnPrice}>+₹{addon.price}</span>
                                </div>
                                <div className={`${styles.addOnCheck} ${addon.selected ? styles.checked : ''}`}>
                                    {addon.selected && <CheckIcon />}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Special Instructions */}
                <div className={styles.section}>
                    <h3>Special Instructions</h3>
                    <textarea
                        className={styles.instructionsInput}
                        placeholder="E.g., No onions, less spicy, allergy notes..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Nutritional Info Toggle */}
                <div className={styles.nutritionSection}>
                    <button
                        className={styles.nutritionToggle}
                        onClick={() => setShowNutrition(!showNutrition)}
                    >
                        <InfoIcon />
                        <span>Nutritional Information</span>
                        <span className={`${styles.toggleArrow} ${showNutrition ? styles.open : ''}`}>▼</span>
                    </button>

                    <AnimatePresence>
                        {showNutrition && (
                            <motion.div
                                className={styles.nutritionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className={styles.nutritionGrid}>
                                    <div className={styles.nutritionItem}>
                                        <span className={styles.nutritionValue}>{dish.nutritionalInfo.calories}</span>
                                        <span className={styles.nutritionLabel}>Calories</span>
                                    </div>
                                    <div className={styles.nutritionItem}>
                                        <span className={styles.nutritionValue}>{dish.nutritionalInfo.protein}g</span>
                                        <span className={styles.nutritionLabel}>Protein</span>
                                    </div>
                                    <div className={styles.nutritionItem}>
                                        <span className={styles.nutritionValue}>{dish.nutritionalInfo.carbs}g</span>
                                        <span className={styles.nutritionLabel}>Carbs</span>
                                    </div>
                                    <div className={styles.nutritionItem}>
                                        <span className={styles.nutritionValue}>{dish.nutritionalInfo.fat}g</span>
                                        <span className={styles.nutritionLabel}>Fat</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Goes Well With (Upsell) */}
                <div className={styles.upsellSection}>
                    <h3>Goes well with...</h3>
                    <div className={styles.upsellScroll}>
                        {dish.goesWellWith.map((item) => (
                            <div key={item.id} className={styles.upsellCard}>
                                <img src={item.image} alt={item.name} />
                                <span className={styles.upsellName}>{item.name}</span>
                                <span className={styles.upsellPrice}>₹{item.price}</span>
                                <button className={styles.upsellAddBtn}>
                                    <PlusIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.quantitySelector}>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                    >
                        <MinusIcon />
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => setQuantity(q => q + 1)}
                    >
                        <PlusIcon />
                    </button>
                </div>

                <motion.button
                    className={`${styles.addToCartBtn} ${!selectedSize ? styles.disabled : ''}`}
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    whileTap={selectedSize ? { scale: 0.98 } : {}}
                >
                    <span>Add to Cart</span>
                    <span className={styles.cartPrice}>₹{calculatePrice()}</span>
                </motion.button>
            </div>
        </div>
    );
}

'use client';

/**
 * Tavlo Restaurant ERP - Add New Dish Page
 * 
 * Page for adding new menu items with:
 * - Image upload and preview
 * - Pricing variants (Half, Full, Quarter)
 * - Ingredients management
 * - Nutrition info (calories, prep time)
 * - Category and tags
 * 
 * @route /menu/add
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { mockCategories } from '@/data/mock-data';
import styles from './page.module.css';

// Icons
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const ImageIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

interface DishFormData {
    name: string;
    description: string;
    shortDescription: string;
    images: string[];
    categoryId: string;
    priceHalf: string;
    priceFull: string;
    priceQuarter: string;
    discountedPrice: string;
    calories: string;
    preparationTime: string;
    isVegetarian: boolean;
    isVegan: boolean;
    isAvailable: boolean;
    isPopular: boolean;
    isFeatured: boolean;
    spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';
    ingredients: string[];
    allergens: string[];
}

export default function AddDishPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [newIngredient, setNewIngredient] = useState('');
    const [newAllergen, setNewAllergen] = useState('');
    const [formData, setFormData] = useState<DishFormData>({
        name: '',
        description: '',
        shortDescription: '',
        images: [],
        categoryId: '',
        priceHalf: '',
        priceFull: '',
        priceQuarter: '',
        discountedPrice: '',
        calories: '',
        preparationTime: '15',
        isVegetarian: false,
        isVegan: false,
        isAvailable: true,
        isPopular: false,
        isFeatured: false,
        spiceLevel: 'mild',
        ingredients: [],
        allergens: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setFormData(prev => ({
                    ...prev,
                    images: [imageUrl]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addIngredient = () => {
        if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, newIngredient.trim()]
            }));
            setNewIngredient('');
        }
    };

    const removeIngredient = (ingredient: string) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i !== ingredient)
        }));
    };

    const addAllergen = () => {
        if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
            setFormData(prev => ({
                ...prev,
                allergens: [...prev.allergens, newAllergen.trim()]
            }));
            setNewAllergen('');
        }
    };

    const removeAllergen = (allergen: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens.filter(a => a !== allergen)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.priceFull) {
            alert('Please enter dish name and price');
            return;
        }

        setIsSaving(true);

        // Create new menu item
        const newItem = {
            _id: `item_${Date.now()}`,
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            description: formData.description,
            shortDescription: formData.shortDescription,
            price: parseFloat(formData.priceFull) || 0,
            discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
            images: formData.images.length > 0 ? formData.images : ['/placeholder-food.jpg'],
            categoryId: formData.categoryId || 'cat_001',
            tags: formData.isVegetarian ? ['veg'] : ['non-veg'],
            isVegetarian: formData.isVegetarian,
            isVegan: formData.isVegan,
            spiceLevel: formData.spiceLevel,
            preparationTime: parseInt(formData.preparationTime) || 15,
            calories: formData.calories ? parseInt(formData.calories) : undefined,
            ingredients: formData.ingredients,
            allergens: formData.allergens,
            isAvailable: formData.isAvailable,
            isPopular: formData.isPopular,
            isFeatured: formData.isFeatured,
            rating: 4.5,
            reviewCount: 0,
            totalOrders: 0,
            restaurantId: 'rest_001',
            createdAt: new Date(),
        };

        // Store in localStorage to persist across page navigation
        const storedItems = localStorage.getItem('newMenuItems');
        const newItems = storedItems ? JSON.parse(storedItems) : [];
        newItems.push(newItem);
        localStorage.setItem('newMenuItems', JSON.stringify(newItems));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsSaving(false);
        router.push('/menu');
    };

    return (
        
            <div className={styles.editPage}>
                {/* Header */}
                <header className={styles.header}>
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <BackIcon />
                        <span>Back to Menu</span>
                    </button>
                    <div className={styles.headerActions}>
                        <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="addDishForm"
                            className={styles.saveBtn}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Adding...' : 'Add Dish'}
                        </button>
                    </div>
                </header>

                <form id="addDishForm" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        {/* Left Column - Image & Basic Info */}
                        <div className={styles.leftColumn}>
                            {/* Image Upload */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Dish Image</h3>
                                <div className={styles.imageUpload}>
                                    {formData.images[0] ? (
                                        <div className={styles.imagePreview}>
                                            <img src={formData.images[0]} alt="Dish preview" />
                                            <label className={styles.changeImageBtn}>
                                                Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    hidden
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className={styles.uploadArea}>
                                            <ImageIcon />
                                            <span className={styles.uploadText}>Click to upload image</span>
                                            <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                hidden
                                            />
                                        </label>
                                    )}
                                </div>
                            </section>

                            {/* Basic Info */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Basic Information</h3>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Dish Name <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={styles.input}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter dish name"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Short Description</label>
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        className={styles.input}
                                        value={formData.shortDescription}
                                        onChange={handleInputChange}
                                        placeholder="Brief description for cards"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Description</label>
                                    <textarea
                                        name="description"
                                        className={styles.textarea}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Detailed description of the dish"
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Category</label>
                                    <select
                                        name="categoryId"
                                        className={styles.select}
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        {mockCategories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Pricing, Nutrition, Options */}
                        <div className={styles.rightColumn}>
                            {/* Pricing Section */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Pricing</h3>
                                <div className={styles.pricingGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Quarter Price (₹)</label>
                                        <input
                                            type="number"
                                            name="priceQuarter"
                                            className={styles.input}
                                            value={formData.priceQuarter}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Half Price (₹)</label>
                                        <input
                                            type="number"
                                            name="priceHalf"
                                            className={styles.input}
                                            value={formData.priceHalf}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Price (₹) <span className={styles.required}>*</span></label>
                                        <input
                                            type="number"
                                            name="priceFull"
                                            className={styles.input}
                                            value={formData.priceFull}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Discounted Price (₹)</label>
                                        <input
                                            type="number"
                                            name="discountedPrice"
                                            className={styles.input}
                                            value={formData.discountedPrice}
                                            onChange={handleInputChange}
                                            placeholder="Leave empty if no discount"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Nutrition Section */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Nutrition & Time</h3>
                                <div className={styles.nutritionGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Calories (kcal)</label>
                                        <input
                                            type="number"
                                            name="calories"
                                            className={styles.input}
                                            value={formData.calories}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 450"
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Prep Time (mins)</label>
                                        <input
                                            type="number"
                                            name="preparationTime"
                                            className={styles.input}
                                            value={formData.preparationTime}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 20"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Options Section */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Options</h3>

                                <div className={styles.optionsGrid}>
                                    <label className={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            name="isVegetarian"
                                            checked={formData.isVegetarian}
                                            onChange={handleInputChange}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span>Vegetarian</span>
                                    </label>

                                    <label className={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            name="isVegan"
                                            checked={formData.isVegan}
                                            onChange={handleInputChange}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span>Vegan</span>
                                    </label>

                                    <label className={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            name="isAvailable"
                                            checked={formData.isAvailable}
                                            onChange={handleInputChange}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span>Available</span>
                                    </label>

                                    <label className={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            name="isPopular"
                                            checked={formData.isPopular}
                                            onChange={handleInputChange}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span>Popular / Bestseller</span>
                                    </label>

                                    <label className={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleInputChange}
                                            className={styles.toggleInput}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span>Featured</span>
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Spice Level</label>
                                    <div className={styles.spiceLevels}>
                                        {['mild', 'medium', 'hot', 'extra-hot'].map(level => (
                                            <label key={level} className={styles.spiceOption}>
                                                <input
                                                    type="radio"
                                                    name="spiceLevel"
                                                    value={level}
                                                    checked={formData.spiceLevel === level}
                                                    onChange={handleInputChange}
                                                />
                                                <span className={`${styles.spiceBadge} ${styles[level]}`}>
                                                    {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Ingredients Section */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Ingredients</h3>
                                <div className={styles.tagInput}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={newIngredient}
                                        onChange={(e) => setNewIngredient(e.target.value)}
                                        placeholder="Add ingredient"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                                    />
                                    <button type="button" className={styles.addTagBtn} onClick={addIngredient}>
                                        <PlusIcon />
                                    </button>
                                </div>
                                <div className={styles.tagsList}>
                                    {formData.ingredients.map(ingredient => (
                                        <span key={ingredient} className={styles.tag}>
                                            {ingredient}
                                            <button type="button" onClick={() => removeIngredient(ingredient)}>
                                                <CloseIcon />
                                            </button>
                                        </span>
                                    ))}
                                    {formData.ingredients.length === 0 && (
                                        <span className={styles.emptyTags}>No ingredients added</span>
                                    )}
                                </div>
                            </section>

                            {/* Allergens Section */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Allergens</h3>
                                <div className={styles.tagInput}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={newAllergen}
                                        onChange={(e) => setNewAllergen(e.target.value)}
                                        placeholder="Add allergen (e.g., Nuts, Dairy)"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                                    />
                                    <button type="button" className={styles.addTagBtn} onClick={addAllergen}>
                                        <PlusIcon />
                                    </button>
                                </div>
                                <div className={styles.tagsList}>
                                    {formData.allergens.map(allergen => (
                                        <span key={allergen} className={`${styles.tag} ${styles.allergenTag}`}>
                                            {allergen}
                                            <button type="button" onClick={() => removeAllergen(allergen)}>
                                                <CloseIcon />
                                            </button>
                                        </span>
                                    ))}
                                    {formData.allergens.length === 0 && (
                                        <span className={styles.emptyTags}>No allergens listed</span>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </form>
            </div>
        
    );
}

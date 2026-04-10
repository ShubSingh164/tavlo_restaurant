'use client';

/**
 * Tavlo Restaurant ERP - Restaurant Basic Details (Step 1)
 * First step of the onboarding process
 *
 * BACKEND INTEGRATION: Saves/loads data via POST/GET /api/restaurant
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

export default function BasicDetailsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        restaurantName: '',
        restaurantType: '',
        cuisineType: [] as string[],
        yearEstablished: '',
    });

    // ─── Load existing data from backend ──────────────────────────────────
    useEffect(() => {
        const stored = sessionStorage.getItem('tavlo_onboarding');
        if (stored) {
            const { email } = JSON.parse(stored);
            if (email) {
                setIsLoading(true);
                restaurantApi.getByEmail(email)
                    .then((res) => {
                        const d = res.data;
                        if (d) {
                            setFormData({
                                restaurantName: (d.restaurantName as string) || '',
                                restaurantType: (d.restaurantType as string) || '',
                                cuisineType: (d.cuisineType as string[]) || [],
                                yearEstablished: (d.yearEstablished as string) || '',
                            });
                        }
                    })
                    .catch(() => { /* First time — no data yet */ })
                    .finally(() => setIsLoading(false));
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCuisineChange = (cuisine: string) => {
        setFormData(prev => ({
            ...prev,
            cuisineType: prev.cuisineType.includes(cuisine)
                ? prev.cuisineType.filter(c => c !== cuisine)
                : [...prev.cuisineType, cuisine]
        }));
    };

    // ─── Save to backend and navigate ─────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const stored = sessionStorage.getItem('tavlo_onboarding');
            if (stored) {
                const { email } = JSON.parse(stored);
                await restaurantApi.saveStep(email, 1, formData as unknown as Record<string, unknown>);
            }
            router.push('/onboarding/location');
        } catch (error) {
            console.error('Failed to save basic details:', error);
            // Navigate anyway — data can be saved on retry
            router.push('/onboarding/location');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={1}
            title="Restaurant Basic Details"
            subtitle="Tell us about your restaurant"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Restaurant Name<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="restaurantName"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.restaurantName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Restaurant Type<span className={styles.required}>*</span>
                    </label>
                    <select
                        name="restaurantType"
                        className={styles.select}
                        value={formData.restaurantType}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="">Select Option</option>
                        <option value="fine-dining">Fine Dining</option>
                        <option value="casual-dining">Casual Dining</option>
                        <option value="fast-food">Fast Food</option>
                        <option value="cafe">Cafe</option>
                        <option value="qsr">Quick Service Restaurant (QSR)</option>
                        <option value="cloud-kitchen">Cloud Kitchen</option>
                        <option value="food-truck">Food Truck</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Upload Restaurant Logo<span className={styles.required}>*</span>
                    </label>
                    <div className={styles.fileUpload}>
                        <svg className={styles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className={styles.fileUploadText}>
                            <span>Choose file to upload</span><br />
                            PNG, JPG up to 5MB
                        </p>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Cuisine Type<span className={styles.required}>*</span>
                    </label>
                    <div className={styles.checkboxGroup}>
                        {['North Indian', 'South Indian', 'Chinese', 'Continental', 'Italian', 'Mexican'].map(cuisine => (
                            <label key={cuisine} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={formData.cuisineType.includes(cuisine)}
                                    onChange={() => handleCuisineChange(cuisine)}
                                    disabled={isLoading}
                                />
                                {cuisine}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Year of Establishment
                    </label>
                    <input
                        type="text"
                        name="yearEstablished"
                        className={styles.input}
                        placeholder="Ex. 1984 (optional)"
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.btnSkip}
                        onClick={() => router.push('/dashboard')}
                    >
                        Skip for now
                    </button>
                    <button type="submit" className={styles.btnNext} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

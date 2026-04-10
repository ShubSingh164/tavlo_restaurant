'use client';

/**
 * Tavlo Restaurant ERP - Restaurant Operations Setup (Step 4)
 * BACKEND INTEGRATION: Saves/loads data via POST/GET /api/restaurant
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

export default function OperationsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        openTime: '',
        closeTime: '',
        deliveryEnabled: true,
        takeawayEnabled: true,
        dineInEnabled: true,
        seatingCapacity: '',
        avgPrepTime: '',
    });

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
                                openTime: (d.openTime as string) || '',
                                closeTime: (d.closeTime as string) || '',
                                deliveryEnabled: d.deliveryEnabled !== undefined ? d.deliveryEnabled as boolean : true,
                                takeawayEnabled: d.takeawayEnabled !== undefined ? d.takeawayEnabled as boolean : true,
                                dineInEnabled: d.dineInEnabled !== undefined ? d.dineInEnabled as boolean : true,
                                seatingCapacity: (d.seatingCapacity as string) || '',
                                avgPrepTime: (d.avgPrepTime as string) || '',
                            });
                        }
                    })
                    .catch(() => {})
                    .finally(() => setIsLoading(false));
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const stored = sessionStorage.getItem('tavlo_onboarding');
            if (stored) {
                const { email } = JSON.parse(stored);
                await restaurantApi.saveStep(email, 4, formData as unknown as Record<string, unknown>);
            }
            router.push('/onboarding/payment');
        } catch (error) {
            console.error('Failed to save operations:', error);
            router.push('/onboarding/payment');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={4}
            title="Restaurant Operations Setup"
            subtitle="Configure your restaurant's operations"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Opening Time<span className={styles.required}>*</span></label>
                        <input type="time" name="openTime" className={styles.input} value={formData.openTime} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Closing Time<span className={styles.required}>*</span></label>
                        <input type="time" name="closeTime" className={styles.input} value={formData.closeTime} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Service Types<span className={styles.required}>*</span></label>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" className={styles.checkbox} checked={formData.dineInEnabled} onChange={() => handleToggle('dineInEnabled')} disabled={isLoading} />
                            Dine-In
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" className={styles.checkbox} checked={formData.takeawayEnabled} onChange={() => handleToggle('takeawayEnabled')} disabled={isLoading} />
                            Takeaway
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" className={styles.checkbox} checked={formData.deliveryEnabled} onChange={() => handleToggle('deliveryEnabled')} disabled={isLoading} />
                            Delivery
                        </label>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Seating Capacity</label>
                    <input type="number" name="seatingCapacity" className={styles.input} placeholder="Ex. 50" value={formData.seatingCapacity} onChange={handleInputChange} disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Average Preparation Time (minutes)</label>
                    <input type="number" name="avgPrepTime" className={styles.input} placeholder="Ex. 20" value={formData.avgPrepTime} onChange={handleInputChange} disabled={isLoading} />
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnPrevious} onClick={() => router.push('/onboarding/legal')}>Previous</button>
                    <button type="submit" className={styles.btnNext} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

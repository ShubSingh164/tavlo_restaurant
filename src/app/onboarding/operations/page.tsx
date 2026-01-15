'use client';

/**
 * Tavlo Restaurant ERP - Restaurant Operations Setup (Step 4)
 * Fourth step: Operating hours and service types
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';

export default function OperationsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        openTime: '',
        closeTime: '',
        deliveryEnabled: true,
        takeawayEnabled: true,
        dineInEnabled: true,
        seatingCapacity: '',
        avgPrepTime: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/onboarding/payment');
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
                        <label className={styles.label}>
                            Opening Time<span className={styles.required}>*</span>
                        </label>
                        <input
                            type="time"
                            name="openTime"
                            className={styles.input}
                            value={formData.openTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Closing Time<span className={styles.required}>*</span>
                        </label>
                        <input
                            type="time"
                            name="closeTime"
                            className={styles.input}
                            value={formData.closeTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Service Types<span className={styles.required}>*</span>
                    </label>
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={formData.dineInEnabled}
                                onChange={() => handleToggle('dineInEnabled')}
                            />
                            Dine-In
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={formData.takeawayEnabled}
                                onChange={() => handleToggle('takeawayEnabled')}
                            />
                            Takeaway
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={formData.deliveryEnabled}
                                onChange={() => handleToggle('deliveryEnabled')}
                            />
                            Delivery
                        </label>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Seating Capacity
                    </label>
                    <input
                        type="number"
                        name="seatingCapacity"
                        className={styles.input}
                        placeholder="Ex. 50"
                        value={formData.seatingCapacity}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Average Preparation Time (minutes)
                    </label>
                    <input
                        type="number"
                        name="avgPrepTime"
                        className={styles.input}
                        placeholder="Ex. 20"
                        value={formData.avgPrepTime}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.btnPrevious}
                        onClick={() => router.push('/onboarding/legal')}
                    >
                        Previous
                    </button>
                    <button type="submit" className={styles.btnNext}>
                        Save Changes
                    </button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

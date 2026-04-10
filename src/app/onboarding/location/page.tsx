'use client';

/**
 * Tavlo Restaurant ERP - Location and Contact Details (Step 2)
 * BACKEND INTEGRATION: Saves/loads data via POST/GET /api/restaurant
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

export default function LocationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        ownerName: '',
        supportEmail: '',
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
                                address: (d.address as string) || '',
                                city: (d.city as string) || '',
                                state: (d.state as string) || '',
                                pincode: (d.pincode as string) || '',
                                phone: (d.phone as string) || '',
                                ownerName: (d.ownerName as string) || '',
                                supportEmail: (d.supportEmail as string) || '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const stored = sessionStorage.getItem('tavlo_onboarding');
            if (stored) {
                const { email } = JSON.parse(stored);
                await restaurantApi.saveStep(email, 2, formData as unknown as Record<string, unknown>);
            }
            router.push('/onboarding/legal');
        } catch (error) {
            console.error('Failed to save location:', error);
            router.push('/onboarding/legal');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={2}
            title="Location and Contact Details"
            subtitle="Where can customers find you?"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Restaurant Address<span className={styles.required}>*</span>
                    </label>
                    <input type="text" name="address" className={styles.input} placeholder="Ex. 123 Main Street, Chandni Chowk" value={formData.address} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>City<span className={styles.required}>*</span></label>
                        <input type="text" name="city" className={styles.input} placeholder="Ex. Delhi" value={formData.city} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>State<span className={styles.required}>*</span></label>
                        <select name="state" className={styles.select} value={formData.state} onChange={handleInputChange} required disabled={isLoading}>
                            <option value="">Select State</option>
                            <option value="delhi">Delhi</option>
                            <option value="maharashtra">Maharashtra</option>
                            <option value="karnataka">Karnataka</option>
                            <option value="tamil-nadu">Tamil Nadu</option>
                            <option value="gujarat">Gujarat</option>
                            <option value="rajasthan">Rajasthan</option>
                            <option value="uttar-pradesh">Uttar Pradesh</option>
                            <option value="west-bengal">West Bengal</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Pincode<span className={styles.required}>*</span></label>
                    <input type="text" name="pincode" className={styles.input} placeholder="Ex. 110006" value={formData.pincode} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Restaurant Phone No.<span className={styles.required}>*</span></label>
                    <input type="tel" name="phone" className={styles.input} placeholder="Ex. +91 98765 43210" value={formData.phone} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Owner Name<span className={styles.required}>*</span></label>
                    <input type="text" name="ownerName" className={styles.input} placeholder="Ex. Shiv Kishan Agarwal" value={formData.ownerName} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Support Email<span className={styles.required}>*</span></label>
                    <input type="email" name="supportEmail" className={styles.input} placeholder="Ex. support@restaurant.com" value={formData.supportEmail} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnPrevious} onClick={() => router.push('/onboarding/basic-details')}>Previous</button>
                    <button type="submit" className={styles.btnNext} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

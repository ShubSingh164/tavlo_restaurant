'use client';

/**
 * Tavlo Restaurant ERP - Legal and Business Information (Step 3)
 * BACKEND INTEGRATION: Saves/loads data via POST/GET /api/restaurant
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

export default function LegalPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        businessType: '',
        gstNo: '',
        fssaiNo: '',
        panNo: '',
        legalName: '',
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
                                businessType: (d.businessType as string) || '',
                                gstNo: (d.gstNo as string) || '',
                                fssaiNo: (d.fssaiNo as string) || '',
                                panNo: (d.panNo as string) || '',
                                legalName: (d.legalName as string) || '',
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
                await restaurantApi.saveStep(email, 3, formData as unknown as Record<string, unknown>);
            }
            router.push('/onboarding/operations');
        } catch (error) {
            console.error('Failed to save legal info:', error);
            router.push('/onboarding/operations');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={3}
            title="Legal and Business Information"
            subtitle="Your business compliance details"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Business Type<span className={styles.required}>*</span></label>
                    <select name="businessType" className={styles.select} value={formData.businessType} onChange={handleInputChange} required disabled={isLoading}>
                        <option value="">Select Type</option>
                        <option value="sole-proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="pvt-ltd">Private Limited Company</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="opc">One Person Company (OPC)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>GST No.<span className={styles.required}>*</span></label>
                    <input type="text" name="gstNo" className={styles.input} placeholder="Ex. 09AAACH1234A1Z5" value={formData.gstNo} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>FSSAI No.<span className={styles.required}>*</span></label>
                    <input type="text" name="fssaiNo" className={styles.input} placeholder="Ex. 10012345678901" value={formData.fssaiNo} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>PAN No.<span className={styles.required}>*</span></label>
                    <input type="text" name="panNo" className={styles.input} placeholder="Ex. AAACH1234A" value={formData.panNo} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Legal Name<span className={styles.required}>*</span></label>
                    <input type="text" name="legalName" className={styles.input} placeholder="Ex. Haldiram Foods Pvt. Ltd." value={formData.legalName} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnPrevious} onClick={() => router.push('/onboarding/location')}>Previous</button>
                    <button type="submit" className={styles.btnNext} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

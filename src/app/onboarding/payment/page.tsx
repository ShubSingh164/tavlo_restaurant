'use client';

/**
 * Tavlo Restaurant ERP - Payment Setup (Step 5)
 * BACKEND INTEGRATION: Saves/loads data via POST/GET /api/restaurant
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

export default function PaymentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        paymentMethods: ['upi', 'card', 'cash'] as string[],
        accountHolder: '',
        accountNo: '',
        ifscCode: '',
        bankLegalName: '',
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
                                paymentMethods: (d.paymentMethods as string[]) || ['upi', 'card', 'cash'],
                                accountHolder: (d.accountHolder as string) || '',
                                accountNo: (d.accountNo as string) || '',
                                ifscCode: (d.ifscCode as string) || '',
                                bankLegalName: (d.bankLegalName as string) || '',
                            });
                        }
                    })
                    .catch(() => {})
                    .finally(() => setIsLoading(false));
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethod = (method: string) => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.includes(method)
                ? prev.paymentMethods.filter(m => m !== method)
                : [...prev.paymentMethods, method]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const stored = sessionStorage.getItem('tavlo_onboarding');
            if (stored) {
                const { email } = JSON.parse(stored);
                await restaurantApi.saveStep(email, 5, formData as unknown as Record<string, unknown>);
            }
            router.push('/onboarding/review');
        } catch (error) {
            console.error('Failed to save payment:', error);
            router.push('/onboarding/review');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <OnboardingLayout
            currentStep={5}
            title="Payment Setup"
            subtitle="Configure your payment methods and bank details"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Payment Method<span className={styles.required}>*</span></label>
                    <div className={styles.toggleGroup}>
                        <button type="button" className={`${styles.toggleBtn} ${formData.paymentMethods.includes('upi') ? styles.active : ''}`} onClick={() => handlePaymentMethod('upi')} disabled={isLoading}>UPI</button>
                        <button type="button" className={`${styles.toggleBtn} ${formData.paymentMethods.includes('card') ? styles.active : ''}`} onClick={() => handlePaymentMethod('card')} disabled={isLoading}>CARD</button>
                        <button type="button" className={`${styles.toggleBtn} ${formData.paymentMethods.includes('cash') ? styles.active : ''}`} onClick={() => handlePaymentMethod('cash')} disabled={isLoading}>CASH</button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Bank Account Holder<span className={styles.required}>*</span></label>
                    <input type="text" name="accountHolder" className={styles.input} placeholder="Ex. Haldiram Foods Pvt. Ltd." value={formData.accountHolder} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Bank Account No.<span className={styles.required}>*</span></label>
                    <input type="text" name="accountNo" className={styles.input} placeholder="Ex. 00234345636894" value={formData.accountNo} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>IFSC Code<span className={styles.required}>*</span></label>
                    <input type="text" name="ifscCode" className={styles.input} placeholder="Ex. PUNB0044400" value={formData.ifscCode} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Legal Name<span className={styles.required}>*</span></label>
                    <input type="text" name="bankLegalName" className={styles.input} placeholder="Ex. Haldiram Foods Pvt. Ltd." value={formData.bankLegalName} onChange={handleInputChange} required disabled={isLoading} />
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnPrevious} onClick={() => router.push('/onboarding/operations')}>Previous</button>
                    <button type="submit" className={styles.btnNext} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </OnboardingLayout>
    );
}

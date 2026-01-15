'use client';

/**
 * Tavlo Restaurant ERP - Payment Setup (Step 5)
 * Fifth step: Payment methods and bank details
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';

export default function PaymentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        paymentMethods: ['upi', 'card', 'cash'] as string[],
        accountHolder: '',
        accountNo: '',
        ifscCode: '',
        legalName: '',
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/onboarding/review');
    };

    return (
        <OnboardingLayout
            currentStep={5}
            title="Payment Setup"
            subtitle="Configure your payment methods and bank details"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Payment Method<span className={styles.required}>*</span>
                    </label>
                    <div className={styles.toggleGroup}>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${formData.paymentMethods.includes('upi') ? styles.active : ''}`}
                            onClick={() => handlePaymentMethod('upi')}
                        >
                            UPI
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${formData.paymentMethods.includes('card') ? styles.active : ''}`}
                            onClick={() => handlePaymentMethod('card')}
                        >
                            CARD
                        </button>
                        <button
                            type="button"
                            className={`${styles.toggleBtn} ${formData.paymentMethods.includes('cash') ? styles.active : ''}`}
                            onClick={() => handlePaymentMethod('cash')}
                        >
                            CASH
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Bank Account Holder<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="accountHolder"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.accountHolder}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Bank Account No.<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="accountNo"
                        className={styles.input}
                        placeholder="Ex. 00234345636894"
                        value={formData.accountNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        IFSC Code<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="ifscCode"
                        className={styles.input}
                        placeholder="Ex. PUNB0044400"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Legal Name<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="legalName"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.legalName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.btnPrevious}
                        onClick={() => router.push('/onboarding/operations')}
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

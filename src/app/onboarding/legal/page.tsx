'use client';

/**
 * Tavlo Restaurant ERP - Legal and Business Information (Step 3)
 * Third step: Legal documents and business details
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';

export default function LegalPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        businessType: '',
        gstNo: '',
        fssaiNo: '',
        panNo: '',
        legalName: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/onboarding/operations');
    };

    return (
        <OnboardingLayout
            currentStep={3}
            title="Legal and Business Information"
            subtitle="Your business compliance details"
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Business Type<span className={styles.required}>*</span>
                    </label>
                    <select
                        name="businessType"
                        className={styles.select}
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Ex. Haldiram</option>
                        <option value="sole-proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="pvt-ltd">Private Limited Company</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="opc">One Person Company (OPC)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        GST No.<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="gstNo"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.gstNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        FSSAI No.<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="fssaiNo"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.fssaiNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        PAN No.<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="panNo"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.panNo}
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
                        onClick={() => router.push('/onboarding/location')}
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

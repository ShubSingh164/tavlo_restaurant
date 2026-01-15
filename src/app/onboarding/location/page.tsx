'use client';

/**
 * Tavlo Restaurant ERP - Location and Contact Details (Step 2)
 * Second step: Address and contact information
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';

export default function LocationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        ownerName: '',
        supportEmail: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/onboarding/legal');
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
                    <input
                        type="text"
                        name="address"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            City<span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            className={styles.input}
                            placeholder="Ex. Haldiram"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            State<span className={styles.required}>*</span>
                        </label>
                        <select
                            name="state"
                            className={styles.select}
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Ex. Haldiram</option>
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
                    <label className={styles.label}>
                        Pincode<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="pincode"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Restaurant Phone No.<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Owner Name<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="ownerName"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Support Email<span className={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        name="supportEmail"
                        className={styles.input}
                        placeholder="Ex. Haldiram"
                        value={formData.supportEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.btnPrevious}
                        onClick={() => router.push('/onboarding/basic-details')}
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

'use client';

/**
 * Tavlo Restaurant ERP - Review & Go Live (Step 6)
 * Final step: Review all information and go live
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';

// Mock data - In real app, this would come from context/state
const mockData = {
    basic: {
        restaurantName: 'Haldiram',
        restaurantType: 'Quick Service Restaurant',
        cuisineType: 'North Indian, South Indian',
        yearEstablished: '1984',
    },
    location: {
        address: '123 Main Street, Chandni Chowk',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110006',
        phone: '+91 98765 43210',
        ownerName: 'Shiv Kishan Agarwal',
        supportEmail: 'support@haldiram.com',
    },
    legal: {
        businessType: 'Private Limited Company',
        gstNo: '09AAACH1234A1Z5',
        fssaiNo: '10012345678901',
        panNo: 'AAACH1234A',
        legalName: 'Haldiram Foods Pvt. Ltd.',
    },
    operations: {
        openTime: '09:00 AM',
        closeTime: '11:00 PM',
        serviceTypes: 'Dine-In, Takeaway, Delivery',
        seatingCapacity: '150',
    },
    payment: {
        paymentMethods: 'UPI, Card, Cash',
        accountHolder: 'Haldiram Foods Pvt. Ltd.',
        accountNo: '****4567',
        ifscCode: 'PUNB0044400',
    },
};

export default function ReviewPage() {
    const router = useRouter();

    const handleGoLive = () => {
        // In real app, submit all data to API
        alert('Congratulations! Your restaurant is now live on Tavlo!');
        router.push('/dashboard');
    };

    return (
        <OnboardingLayout
            currentStep={6}
            title="Review & Go Live"
            subtitle="Review your information before going live"
        >
            <div className={styles.form}>
                {/* Basic Details Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Restaurant Basic Details</h3>
                        <Link href="/onboarding/basic-details" className={styles.editLink}>
                            Edit
                        </Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Restaurant Name</span>
                            <span className={styles.reviewValue}>{mockData.basic.restaurantName}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Type</span>
                            <span className={styles.reviewValue}>{mockData.basic.restaurantType}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Cuisine</span>
                            <span className={styles.reviewValue}>{mockData.basic.cuisineType}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Established</span>
                            <span className={styles.reviewValue}>{mockData.basic.yearEstablished}</span>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Location & Contact</h3>
                        <Link href="/onboarding/location" className={styles.editLink}>
                            Edit
                        </Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Address</span>
                            <span className={styles.reviewValue}>{mockData.location.address}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>City</span>
                            <span className={styles.reviewValue}>{mockData.location.city}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Phone</span>
                            <span className={styles.reviewValue}>{mockData.location.phone}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Email</span>
                            <span className={styles.reviewValue}>{mockData.location.supportEmail}</span>
                        </div>
                    </div>
                </div>

                {/* Legal Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Legal & Business</h3>
                        <Link href="/onboarding/legal" className={styles.editLink}>
                            Edit
                        </Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Business Type</span>
                            <span className={styles.reviewValue}>{mockData.legal.businessType}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>GST No.</span>
                            <span className={styles.reviewValue}>{mockData.legal.gstNo}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>FSSAI No.</span>
                            <span className={styles.reviewValue}>{mockData.legal.fssaiNo}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Legal Name</span>
                            <span className={styles.reviewValue}>{mockData.legal.legalName}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Payment Setup</h3>
                        <Link href="/onboarding/payment" className={styles.editLink}>
                            Edit
                        </Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Payment Methods</span>
                            <span className={styles.reviewValue}>{mockData.payment.paymentMethods}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Account Holder</span>
                            <span className={styles.reviewValue}>{mockData.payment.accountHolder}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Account No.</span>
                            <span className={styles.reviewValue}>{mockData.payment.accountNo}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>IFSC</span>
                            <span className={styles.reviewValue}>{mockData.payment.ifscCode}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.btnPrevious}
                        onClick={() => router.push('/onboarding/payment')}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className={styles.btnGoLive}
                        onClick={handleGoLive}
                    >
                        Go Live 🚀
                    </button>
                </div>
            </div>
        </OnboardingLayout>
    );
}

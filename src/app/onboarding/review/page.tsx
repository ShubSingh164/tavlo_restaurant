'use client';

/**
 * Tavlo Restaurant ERP - Review & Go Live (Step 6)
 * Final step: Review all information from the database and go live.
 *
 * BACKEND INTEGRATION:
 *   - GET /api/restaurant?email=... — Loads all saved onboarding data
 *   - POST /api/restaurant { goLive: true } — Marks restaurant as live
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import styles from '@/components/onboarding/onboarding.module.css';
import { restaurantApi } from '@/lib/api-client';

// ─── Label Mappers (for display-friendly values) ─────────────────────────────

const restaurantTypeLabels: Record<string, string> = {
    'fine-dining': 'Fine Dining',
    'casual-dining': 'Casual Dining',
    'fast-food': 'Fast Food',
    'cafe': 'Cafe',
    'qsr': 'Quick Service Restaurant',
    'cloud-kitchen': 'Cloud Kitchen',
    'food-truck': 'Food Truck',
};

const businessTypeLabels: Record<string, string> = {
    'sole-proprietorship': 'Sole Proprietorship',
    'partnership': 'Partnership',
    'pvt-ltd': 'Private Limited Company',
    'llp': 'Limited Liability Partnership',
    'opc': 'One Person Company',
};

const stateLabels: Record<string, string> = {
    'delhi': 'Delhi',
    'maharashtra': 'Maharashtra',
    'karnataka': 'Karnataka',
    'tamil-nadu': 'Tamil Nadu',
    'gujarat': 'Gujarat',
    'rajasthan': 'Rajasthan',
    'uttar-pradesh': 'Uttar Pradesh',
    'west-bengal': 'West Bengal',
};

interface RestaurantData {
    restaurantName?: string;
    restaurantType?: string;
    cuisineType?: string[];
    yearEstablished?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    ownerName?: string;
    supportEmail?: string;
    businessType?: string;
    gstNo?: string;
    fssaiNo?: string;
    panNo?: string;
    legalName?: string;
    openTime?: string;
    closeTime?: string;
    dineInEnabled?: boolean;
    takeawayEnabled?: boolean;
    deliveryEnabled?: boolean;
    seatingCapacity?: string;
    avgPrepTime?: string;
    paymentMethods?: string[];
    accountHolder?: string;
    accountNo?: string;
    ifscCode?: string;
    bankLegalName?: string;
}

export default function ReviewPage() {
    const router = useRouter();
    const [data, setData] = useState<RestaurantData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Load all restaurant data from backend ───────────────────────────
    useEffect(() => {
        const stored = sessionStorage.getItem('tavlo_onboarding');
        if (stored) {
            const { email } = JSON.parse(stored);
            if (email) {
                restaurantApi.getByEmail(email)
                    .then((res) => {
                        if (res.data) {
                            setData(res.data as unknown as RestaurantData);
                        }
                    })
                    .catch((err) => console.error('Failed to load review data:', err))
                    .finally(() => setIsLoading(false));
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    // ─── Go Live Handler ─────────────────────────────────────────────────
    const handleGoLive = async () => {
        setIsSubmitting(true);
        try {
            const stored = sessionStorage.getItem('tavlo_onboarding');
            if (stored) {
                const { email } = JSON.parse(stored);
                await restaurantApi.goLive(email);
            }
            alert('🎉 Congratulations! Your restaurant is now live on Tavlo!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to go live:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Helpers ─────────────────────────────────────────────────────────

    const getServiceTypes = () => {
        const services: string[] = [];
        if (data.dineInEnabled) services.push('Dine-In');
        if (data.takeawayEnabled) services.push('Takeaway');
        if (data.deliveryEnabled) services.push('Delivery');
        return services.join(', ') || '—';
    };

    const maskAccountNo = (accNo?: string) => {
        if (!accNo || accNo.length < 4) return accNo || '—';
        return '****' + accNo.slice(-4);
    };

    if (isLoading) {
        return (
            <OnboardingLayout currentStep={6} title="Review & Go Live" subtitle="Loading your data...">
                <div className={styles.form}>
                    <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading restaurant details...</p>
                </div>
            </OnboardingLayout>
        );
    }

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
                        <Link href="/onboarding/basic-details" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Restaurant Name</span>
                            <span className={styles.reviewValue}>{data.restaurantName || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Type</span>
                            <span className={styles.reviewValue}>{restaurantTypeLabels[data.restaurantType || ''] || data.restaurantType || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Cuisine</span>
                            <span className={styles.reviewValue}>{data.cuisineType?.join(', ') || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Established</span>
                            <span className={styles.reviewValue}>{data.yearEstablished || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Location & Contact</h3>
                        <Link href="/onboarding/location" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Address</span>
                            <span className={styles.reviewValue}>{data.address || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>City</span>
                            <span className={styles.reviewValue}>{data.city || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>State</span>
                            <span className={styles.reviewValue}>{stateLabels[data.state || ''] || data.state || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Phone</span>
                            <span className={styles.reviewValue}>{data.phone || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Owner</span>
                            <span className={styles.reviewValue}>{data.ownerName || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Email</span>
                            <span className={styles.reviewValue}>{data.supportEmail || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Legal Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Legal & Business</h3>
                        <Link href="/onboarding/legal" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Business Type</span>
                            <span className={styles.reviewValue}>{businessTypeLabels[data.businessType || ''] || data.businessType || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>GST No.</span>
                            <span className={styles.reviewValue}>{data.gstNo || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>FSSAI No.</span>
                            <span className={styles.reviewValue}>{data.fssaiNo || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Legal Name</span>
                            <span className={styles.reviewValue}>{data.legalName || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Operations Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Operations</h3>
                        <Link href="/onboarding/operations" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Hours</span>
                            <span className={styles.reviewValue}>{data.openTime || '—'} — {data.closeTime || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Service Types</span>
                            <span className={styles.reviewValue}>{getServiceTypes()}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Seating</span>
                            <span className={styles.reviewValue}>{data.seatingCapacity || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Avg Prep Time</span>
                            <span className={styles.reviewValue}>{data.avgPrepTime ? `${data.avgPrepTime} min` : '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={styles.reviewSectionTitle}>Payment Setup</h3>
                        <Link href="/onboarding/payment" className={styles.editLink}>Edit</Link>
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Payment Methods</span>
                            <span className={styles.reviewValue}>{data.paymentMethods?.map(m => m.toUpperCase()).join(', ') || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Account Holder</span>
                            <span className={styles.reviewValue}>{data.accountHolder || '—'}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Account No.</span>
                            <span className={styles.reviewValue}>{maskAccountNo(data.accountNo)}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>IFSC</span>
                            <span className={styles.reviewValue}>{data.ifscCode || '—'}</span>
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Going Live...' : 'Go Live 🚀'}
                    </button>
                </div>
            </div>
        </OnboardingLayout>
    );
}

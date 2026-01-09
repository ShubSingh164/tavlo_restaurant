'use client';

/**
 * Tavlo Restaurant ERP - Reviews Page
 * 
 * Customer reviews management with:
 * - Review cards with ratings
 * - Reply to reviews
 * - Filter by rating/date
 * - Analytics on customer sentiment
 * 
 * @component ReviewsPage
 * @route /reviews
 */

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout';
import styles from './page.module.css';

// Mock reviews data
const mockReviews = [
    {
        id: 'rev_001',
        customerName: 'Rahul Sharma',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Absolutely delicious! The Butter Chicken was the best I have ever had. The flavors were perfectly balanced and the naan was freshly baked. Will definitely come back!',
        date: '2026-01-08',
        orderItems: ['Butter Chicken', 'Garlic Naan', 'Mango Lassi'],
        replied: true,
        reply: 'Thank you so much for your kind words! We are thrilled you enjoyed your meal. Looking forward to serving you again!',
    },
    {
        id: 'rev_002',
        customerName: 'Priya Patel',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 4,
        comment: 'Great food and nice ambiance. Service was a bit slow during peak hours but overall a good dining experience. The Paneer Tikka was excellent!',
        date: '2026-01-07',
        orderItems: ['Paneer Tikka', 'Dal Makhani', 'Butter Naan'],
        replied: true,
        reply: 'Thank you for your feedback! We apologize for the wait time and are working on improving our service speed.',
    },
    {
        id: 'rev_003',
        customerName: 'Amit Kumar',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'The Hyderabadi Biryani is out of this world! Authentic taste and generous portions. Perfect spice level. My new favorite restaurant for biryani!',
        date: '2026-01-06',
        orderItems: ['Hyderabadi Biryani', 'Raita'],
        replied: false,
    },
    {
        id: 'rev_004',
        customerName: 'Sneha Gupta',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 3,
        comment: 'Food was okay. The Gulab Jamun was good but the main course was a bit too oily for my taste. Portions were decent though.',
        date: '2026-01-05',
        orderItems: ['Veg Biryani', 'Gulab Jamun'],
        replied: false,
    },
    {
        id: 'rev_005',
        customerName: 'Vikram Singh',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Outstanding experience! From the warm welcome to the perfectly cooked dishes, everything was top-notch. The staff recommendations were spot on!',
        date: '2026-01-04',
        orderItems: ['Butter Chicken', 'Hyderabadi Biryani', 'Gulab Jamun'],
        replied: true,
        reply: 'Thank you for the wonderful review! Our team is dedicated to providing the best experience. See you soon!',
    },
    {
        id: 'rev_006',
        customerName: 'Neha Reddy',
        customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        rating: 4,
        comment: 'Love the Masala Chai here! It reminds me of homemade chai. The samosas were crispy and flavorful. Will be coming back for more!',
        date: '2026-01-03',
        orderItems: ['Masala Chai', 'Samosa'],
        replied: false,
    },
];

// Icons
const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#f97316' : 'none'} stroke="#f97316" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ReplyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 17 4 12 9 7" />
        <path d="M20 18v-2a4 4 0 00-4-4H4" />
    </svg>
);

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

// Rating Stars Component
function RatingStars({ rating }: { rating: number }) {
    return (
        <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= rating} />
            ))}
        </div>
    );
}

// Stats Card
function ReviewStats() {
    const totalReviews = mockReviews.length;
    const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
    const fiveStarCount = mockReviews.filter(r => r.rating === 5).length;
    const pendingReplies = mockReviews.filter(r => !r.replied).length;

    return (
        <div className={styles.statsRow}>
            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{avgRating}</span>
                    <span className={styles.statLabel}>Average Rating</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{totalReviews}</span>
                    <span className={styles.statLabel}>Total Reviews</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{fiveStarCount}</span>
                    <span className={styles.statLabel}>5-Star Reviews</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{pendingReplies}</span>
                    <span className={styles.statLabel}>Pending Replies</span>
                </div>
            </div>
        </div>
    );
}

// Review Card
function ReviewCard({ review }: { review: typeof mockReviews[0] }) {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');

    return (
        <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                    <img src={review.customerAvatar} alt={review.customerName} className={styles.reviewerAvatar} />
                    <div>
                        <span className={styles.reviewerName}>{review.customerName}</span>
                        <span className={styles.reviewDate}>
                            {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <RatingStars rating={review.rating} />
            </div>

            <p className={styles.reviewComment}>{review.comment}</p>

            <div className={styles.orderItems}>
                <span className={styles.orderItemsLabel}>Ordered:</span>
                {review.orderItems.map((item, i) => (
                    <span key={i} className={styles.orderItemTag}>{item}</span>
                ))}
            </div>

            {review.replied && review.reply && (
                <div className={styles.replyBox}>
                    <div className={styles.replyHeader}>
                        <span className={styles.replyLabel}>Your Reply</span>
                    </div>
                    <p className={styles.replyText}>{review.reply}</p>
                </div>
            )}

            {!review.replied && (
                <div className={styles.reviewActions}>
                    {showReplyBox ? (
                        <div className={styles.replyForm}>
                            <textarea
                                className={styles.replyInput}
                                placeholder="Write your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                            />
                            <div className={styles.replyFormActions}>
                                <button className={styles.cancelBtn} onClick={() => setShowReplyBox(false)}>Cancel</button>
                                <button className={styles.submitBtn}>Send Reply</button>
                            </div>
                        </div>
                    ) : (
                        <button className={styles.replyBtn} onClick={() => setShowReplyBox(true)}>
                            <ReplyIcon />
                            Reply
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ReviewsPage() {
    const [ratingFilter, setRatingFilter] = useState('all');

    const filteredReviews = useMemo(() => {
        if (ratingFilter === 'all') return mockReviews;
        return mockReviews.filter(r => r.rating === parseInt(ratingFilter));
    }, [ratingFilter]);

    return (
        <AdminLayout title="Reviews">
            <div className={styles.reviewsPage}>
                <ReviewStats />

                {/* Filters */}
                <div className={styles.filterBar}>
                    <div className={styles.filterLeft}>
                        <h2 className={styles.sectionTitle}>Customer Reviews</h2>
                        <span className={styles.reviewCount}>{filteredReviews.length} reviews</span>
                    </div>
                    <div className={styles.filterRight}>
                        <button className={styles.filterBtn}>
                            <FilterIcon />
                            Filter
                        </button>
                        <select
                            className={styles.ratingSelect}
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className={styles.reviewsGrid}>
                    {filteredReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

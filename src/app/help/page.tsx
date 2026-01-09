'use client';

/**
 * Tavlo Restaurant ERP - Help & Support Page
 * 
 * Support center with:
 * - FAQ sections
 * - Contact form
 * - Quick help links
 * - Documentation links
 * 
 * @component HelpPage
 * @route /help
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import styles from './page.module.css';

// FAQ data
const faqCategories = [
    {
        title: 'Getting Started',
        icon: '🚀',
        items: [
            { question: 'How do I set up my restaurant profile?', answer: 'Go to Settings > Restaurant Profile to add your restaurant details, logo, address, and contact information.' },
            { question: 'How do I add menu items?', answer: 'Navigate to Menu > Add Item. Fill in the item details including name, price, category, and upload an image.' },
            { question: 'How do I configure tables?', answer: 'Go to Settings > Tables to add, edit, or remove tables. You can also generate QR codes for each table.' },
        ],
    },
    {
        title: 'Orders & Billing',
        icon: '📋',
        items: [
            { question: 'How do I process a new order?', answer: 'Orders can be placed via the customer menu (QR code) or manually added from the Orders page by clicking "New Order".' },
            { question: 'How do I issue a refund?', answer: 'Go to the order details, click "Actions" and select "Refund". Enter the refund amount and reason.' },
            { question: 'How do I split a bill?', answer: 'Open the order, click "Split Bill" and choose how to divide the items or amount between multiple payments.' },
        ],
    },
    {
        title: 'Reports & Analytics',
        icon: '📊',
        items: [
            { question: 'How do I view sales reports?', answer: 'Go to Analytics to see sales trends, top items, and revenue breakdowns. You can filter by date range.' },
            { question: 'How do I export reports?', answer: 'Click the "Export" button on any report page to download as PDF or Excel format.' },
            { question: 'How is revenue calculated?', answer: 'Revenue includes all completed orders minus refunds. Tax and service charges are shown separately.' },
        ],
    },
    {
        title: 'Staff Management',
        icon: '👥',
        items: [
            { question: 'How do I add new staff?', answer: 'Go to Staff > Add Staff. Enter their details and assign a role (Manager, Chef, Waiter, Cashier).' },
            { question: 'How do I set staff permissions?', answer: 'Edit the staff member and configure their access levels for different sections of the app.' },
            { question: 'How do I track staff performance?', answer: 'View the Staff page to see orders handled, sales amount, and customer ratings for each employee.' },
        ],
    },
];

const supportOptions = [
    { icon: '📧', title: 'Email Support', description: 'Get help via email within 24 hours', action: 'support@tavlo.com' },
    { icon: '💬', title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat' },
    { icon: '📞', title: 'Phone Support', description: 'Call us during business hours', action: '+91 1800-123-4567' },
    { icon: '📚', title: 'Documentation', description: 'Browse our help articles', action: 'View Docs' },
];

// Icons
const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

// FAQ Accordion Item
function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
            <button className={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className={styles.faqAnswer}>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}

// FAQ Category
function FaqCategory({ category }: { category: typeof faqCategories[0] }) {
    return (
        <div className={styles.faqCategory}>
            <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
            </div>
            <div className={styles.faqList}>
                {category.items.map((item, i) => (
                    <FaqItem key={i} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
}

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <AdminLayout title="Help & Support">
            <div className={styles.helpPage}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>How can we help you?</h1>
                    <p className={styles.heroSubtitle}>Search our knowledge base or browse categories below</p>
                    <div className={styles.searchBox}>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Support Options */}
                <div className={styles.supportOptions}>
                    {supportOptions.map((option, i) => (
                        <div key={i} className={styles.supportCard}>
                            <span className={styles.supportIcon}>{option.icon}</span>
                            <h3 className={styles.supportTitle}>{option.title}</h3>
                            <p className={styles.supportDesc}>{option.description}</p>
                            <span className={styles.supportAction}>{option.action}</span>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className={styles.faqSection}>
                    <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                    <div className={styles.faqGrid}>
                        {faqCategories.map((category, i) => (
                            <FaqCategory key={i} category={category} />
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className={styles.contactSection}>
                    <div className={styles.contactInfo}>
                        <h2 className={styles.contactTitle}>Still need help?</h2>
                        <p className={styles.contactDesc}>
                            Can&apos;t find what you&apos;re looking for? Send us a message and our support team will get back to you within 24 hours.
                        </p>
                        <div className={styles.contactDetails}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📧</span>
                                <div>
                                    <span className={styles.contactLabel}>Email</span>
                                    <span className={styles.contactValue}>support@tavlo.com</span>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📞</span>
                                <div>
                                    <span className={styles.contactLabel}>Phone</span>
                                    <span className={styles.contactValue}>+91 1800-123-4567</span>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>⏰</span>
                                <div>
                                    <span className={styles.contactLabel}>Hours</span>
                                    <span className={styles.contactValue}>Mon-Sat 9AM-6PM IST</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className={styles.contactForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Your Name</label>
                                <input type="text" placeholder="John Doe" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input type="email" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Subject</label>
                            <input type="text" placeholder="How can we help?" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Message</label>
                            <textarea placeholder="Describe your issue..." rows={4} />
                        </div>
                        <button type="submit" className={styles.submitBtn}>Send Message</button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

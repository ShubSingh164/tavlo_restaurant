'use client';

/**
 * Tavlo Restaurant ERP - Settings Page
 * 
 * Comprehensive settings for restaurant configuration:
 * - Restaurant profile & branding
 * - Business hours
 * - Tax & payment settings
 * - Notification preferences
 * - User account settings
 * - Integration settings
 * - Data backup & export
 * 
 * @component SettingsPage
 * @route /settings
 * @backend CRUD on restaurant/user settings
 * @api GET /api/settings - Fetch current settings
 * @api PUT /api/settings - Update settings
 * @api POST /api/settings/export - Export data
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { mockRestaurant } from '@/data/mock-data';
import styles from './page.module.css';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const StoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CreditCardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
);

const DatabaseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

// ============================================================================
// SETTINGS NAVIGATION
// ============================================================================

const settingsSections = [
    { id: 'restaurant', label: 'Restaurant Profile', icon: <StoreIcon />, description: 'Manage your restaurant details and branding' },
    { id: 'hours', label: 'Business Hours', icon: <ClockIcon />, description: 'Set your opening and closing times' },
    { id: 'payments', label: 'Payments & Tax', icon: <CreditCardIcon />, description: 'Configure payment methods and tax rates' },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon />, description: 'Manage email and push notifications' },
    { id: 'account', label: 'Account', icon: <UserIcon />, description: 'Your personal account settings' },
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon />, description: 'Connect third-party services' },
    { id: 'data', label: 'Data & Privacy', icon: <DatabaseIcon />, description: 'Export data and privacy settings' },
    { id: 'security', label: 'Security', icon: <ShieldIcon />, description: 'Password and security options' },
];

// ============================================================================
// RESTAURANT PROFILE SECTION
// ============================================================================

function RestaurantProfile() {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Restaurant Profile</h2>
            <p className={styles.sectionDescription}>Manage your restaurant's public information and branding.</p>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Restaurant Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        defaultValue={mockRestaurant.name}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                        type="tel"
                        className={styles.input}
                        defaultValue={mockRestaurant.phone}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={styles.input}
                        defaultValue={mockRestaurant.email}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Website</label>
                    <input
                        type="url"
                        className={styles.input}
                        defaultValue={mockRestaurant.website}
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Address</label>
                    <input
                        type="text"
                        className={styles.input}
                        defaultValue={mockRestaurant.address.street}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>City</label>
                    <input
                        type="text"
                        className={styles.input}
                        defaultValue={mockRestaurant.address.city}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>State</label>
                    <input
                        type="text"
                        className={styles.input}
                        defaultValue={mockRestaurant.address.state}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>PIN Code</label>
                    <input
                        type="text"
                        className={styles.input}
                        defaultValue={mockRestaurant.address.pincode}
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        rows={3}
                        defaultValue={mockRestaurant.description}
                    />
                </div>
            </div>

            {/* Logo Upload */}
            <div className={styles.uploadSection}>
                <h3 className={styles.uploadTitle}>Restaurant Logo</h3>
                <div className={styles.uploadArea}>
                    <div className={styles.currentLogo}>
                        <img src={mockRestaurant.logo} alt="Logo" />
                    </div>
                    <div className={styles.uploadActions}>
                        <button className={styles.uploadBtn}>Change Logo</button>
                        <span className={styles.uploadHint}>PNG, JPG up to 2MB</span>
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Changes</button>
                <button className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
}

// ============================================================================
// BUSINESS HOURS SECTION
// ============================================================================

function BusinessHours() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Business Hours</h2>
            <p className={styles.sectionDescription}>Set your restaurant's operating hours for each day.</p>

            <div className={styles.hoursGrid}>
                {days.map((day, index) => (
                    <div key={day} className={styles.hoursRow}>
                        <div className={styles.dayInfo}>
                            <label className={styles.dayToggle}>
                                <input type="checkbox" defaultChecked={index < 6} />
                                <span className={styles.toggleSlider}></span>
                            </label>
                            <span className={styles.dayName}>{day}</span>
                        </div>
                        <div className={styles.hoursInputs}>
                            <input type="time" className={styles.timeInput} defaultValue="10:00" />
                            <span className={styles.timeSeparator}>to</span>
                            <input type="time" className={styles.timeInput} defaultValue="22:00" />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.hoursNote}>
                <span className={styles.noteIcon}>💡</span>
                <p>These hours will be displayed on your public menu and Google Business Profile.</p>
            </div>

            <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Hours</button>
                <button className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
}

// ============================================================================
// PAYMENTS & TAX SECTION
// ============================================================================

function PaymentsTax() {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Payments & Tax</h2>
            <p className={styles.sectionDescription}>Configure payment methods and tax settings.</p>

            {/* Payment Methods */}
            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Payment Methods</h3>
                <div className={styles.paymentMethods}>
                    {[
                        { name: 'Cash', enabled: true },
                        { name: 'Credit/Debit Card', enabled: true },
                        { name: 'UPI', enabled: true },
                        { name: 'Paytm', enabled: true },
                        { name: 'PhonePe', enabled: true },
                        { name: 'Google Pay', enabled: true },
                    ].map((method) => (
                        <div key={method.name} className={styles.paymentMethod}>
                            <span className={styles.methodName}>{method.name}</span>
                            <label className={styles.switchLabel}>
                                <input type="checkbox" defaultChecked={method.enabled} />
                                <span className={styles.switch}></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tax Settings */}
            <div className={styles.subsection}>
                <h3 className={styles.subsectionTitle}>Tax Configuration</h3>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>GST Number</label>
                        <input type="text" className={styles.input} defaultValue="29AADCB2230M1ZP" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>CGST Rate (%)</label>
                        <input type="number" className={styles.input} defaultValue="2.5" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>SGST Rate (%)</label>
                        <input type="number" className={styles.input} defaultValue="2.5" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Service Charge (%)</label>
                        <input type="number" className={styles.input} defaultValue="5" />
                    </div>
                </div>

                <div className={styles.taxNote}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        <span>Include taxes in menu prices</span>
                    </label>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Settings</button>
                <button className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
}

// ============================================================================
// NOTIFICATIONS SECTION
// ============================================================================

function Notifications() {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <p className={styles.sectionDescription}>Manage how you receive updates and alerts.</p>

            <div className={styles.notificationGroups}>
                {/* Order Notifications */}
                <div className={styles.notificationGroup}>
                    <h3 className={styles.groupTitle}>Order Notifications</h3>
                    <div className={styles.notificationList}>
                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>New Order Alert</span>
                                <span className={styles.notificationDesc}>Get notified when a new order is placed</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Sound</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>Order Completed</span>
                                <span className={styles.notificationDesc}>Notification when kitchen marks order ready</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" />
                                    <span>Email</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Sound</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>Order Cancellation</span>
                                <span className={styles.notificationDesc}>Alert when an order is cancelled</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Sound</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Notifications */}
                <div className={styles.notificationGroup}>
                    <h3 className={styles.groupTitle}>Business Updates</h3>
                    <div className={styles.notificationList}>
                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>Daily Summary</span>
                                <span className={styles.notificationDesc}>Receive daily sales and order summary</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>Low Stock Alert</span>
                                <span className={styles.notificationDesc}>Alert when inventory items run low</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.notificationItem}>
                            <div className={styles.notificationInfo}>
                                <span className={styles.notificationName}>Customer Reviews</span>
                                <span className={styles.notificationDesc}>Get notified of new customer reviews</span>
                            </div>
                            <div className={styles.notificationControls}>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Push</span>
                                </label>
                                <label className={styles.checkboxSmall}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Preferences</button>
                <button className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
}

// ============================================================================
// ACCOUNT SECTION
// ============================================================================

function AccountSettings() {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            <p className={styles.sectionDescription}>Manage your personal account information.</p>

            <div className={styles.accountHeader}>
                <div className={styles.accountAvatar}>
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Profile" />
                    <button className={styles.avatarEditBtn}>Change</button>
                </div>
                <div className={styles.accountInfo}>
                    <h3 className={styles.accountName}>Rajesh Kumar</h3>
                    <span className={styles.accountRole}>Restaurant Owner</span>
                </div>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input type="text" className={styles.input} defaultValue="Rajesh Kumar" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" className={styles.input} defaultValue="rajesh@haldiram.in" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone</label>
                    <input type="tel" className={styles.input} defaultValue="+91 98765 43210" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Role</label>
                    <select className={styles.select}>
                        <option>Owner</option>
                        <option>Manager</option>
                        <option>Admin</option>
                    </select>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Profile</button>
                <button className={styles.cancelBtn}>Cancel</button>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('restaurant');

    const renderSection = () => {
        switch (activeSection) {
            case 'restaurant':
                return <RestaurantProfile />;
            case 'hours':
                return <BusinessHours />;
            case 'payments':
                return <PaymentsTax />;
            case 'notifications':
                return <Notifications />;
            case 'account':
                return <AccountSettings />;
            default:
                return <RestaurantProfile />;
        }
    };

    return (
        <AdminLayout title="Settings">
            <div className={styles.settingsPage}>
                {/* Sidebar Navigation */}
                <aside className={styles.settingsSidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Settings</h2>
                    </div>
                    <nav className={styles.settingsNav}>
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <span className={styles.navIcon}>{section.icon}</span>
                                <div className={styles.navContent}>
                                    <span className={styles.navLabel}>{section.label}</span>
                                    <span className={styles.navDescription}>{section.description}</span>
                                </div>
                                <ChevronRightIcon />
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className={styles.settingsContent}>
                    {renderSection()}
                </main>
            </div>
        </AdminLayout>
    );
}

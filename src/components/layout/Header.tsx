'use client';

/**
 * Tavlo Restaurant ERP - Header Component
 * 
 * Top navigation bar with search, notifications, and user profile.
 * Displayed at the top of all admin pages.
 * 
 * @component Header
 * @backend Uses user data from auth context
 * @api GET /api/auth/me - Fetch current user
 * @api GET /api/notifications - Fetch user notifications
 */

import React, { useState } from 'react';
import styles from './Header.module.css';

// Icon components
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

interface HeaderProps {
    title?: string;
}

/**
 * Header component with search, date, notifications, and user profile
 */
export default function Header({ title = 'Dashboard' }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    /**
     * @backend Replace with actual user data from auth context
     * @api GET /api/auth/me
     */
    const user = {
        name: 'Rajesh Kumar',
        role: 'Owner',
        avatar: null,
    };

    /**
     * @backend Replace with actual notifications from API
     * @api GET /api/notifications
     */
    const notifications = [
        { id: 1, message: 'New order #0109 received', time: '2 min ago', unread: true },
        { id: 2, message: 'Table #5 needs attention', time: '5 min ago', unread: true },
        { id: 3, message: 'Low stock alert: Butter', time: '1 hour ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    // Get current date formatted
    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <header className={styles.header}>
            {/* Page Title */}
            <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {/* Search Bar */}
            <div className={styles.searchSection}>
                <div className={styles.searchInput}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className={styles.rightSection}>
                {/* Date Selector */}
                <button className={styles.dateSelector}>
                    <CalendarIcon />
                    <span>{currentDate}</span>
                </button>

                {/* Notifications */}
                <div className={styles.notificationWrapper}>
                    <button
                        className={styles.notificationBtn}
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                    >
                        <BellIcon />
                        {unreadCount > 0 && (
                            <span className={styles.notificationBadge}>{unreadCount}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className={styles.notificationDropdown}>
                            <div className={styles.notificationHeader}>
                                <span>Notifications</span>
                                <button className={styles.markAllRead}>Mark all read</button>
                            </div>
                            <div className={styles.notificationList}>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}
                                    >
                                        <p className={styles.notificationMessage}>{notification.message}</p>
                                        <span className={styles.notificationTime}>{notification.time}</span>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.viewAllNotifications}>View all notifications</button>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className={styles.userWrapper}>
                    <button
                        className={styles.userBtn}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        aria-label="User menu"
                    >
                        <div className={styles.userAvatar}>
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>{user.role}</span>
                        </div>
                        <ChevronDownIcon />
                    </button>

                    {showUserMenu && (
                        <div className={styles.userDropdown}>
                            <a href="/profile" className={styles.dropdownItem}>Profile</a>
                            <a href="/settings" className={styles.dropdownItem}>Settings</a>
                            <hr className={styles.dropdownDivider} />
                            <button
                                className={`${styles.dropdownItem} ${styles.logout}`}
                                onClick={() => window.location.href = '/'}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

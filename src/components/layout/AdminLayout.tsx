'use client';

/**
 * Tavlo Restaurant ERP - Admin Layout Wrapper
 * 
 * Main layout component that wraps all admin pages.
 * Includes the sidebar and header.
 * 
 * @component AdminLayout
 * @usage Wrap admin pages with this layout
 */

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './Sidebar';
import Header from './Header';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

// Map of route paths to page titles
const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/orders': 'Orders',
    '/menu': 'Menu Management',
    '/menu/add': 'Add Menu Item',
    '/staff': 'Staff Management',
    '/staff/add': 'Add Staff Member',
    '/customers': 'Customers',
    '/reviews': 'Reviews',
    '/analytics': 'Analytics',
    '/revenue': 'Revenue',
    '/billing': 'Billing & Payments',
    '/taxation': 'Taxation',
    '/delivery': 'Delivery',
    '/messaging': 'Messaging',
    '/settings': 'Settings',
    '/help': 'Help & Support',
};

/**
 * AdminLayout - wraps admin pages with sidebar and header
 * @param children - Page content
 * @param title - Optional override for page title
 */
export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Determine page title from pathname or use provided title
    const getPageTitle = (): string => {
        if (title) return title;

        // Check for exact match first
        if (pageTitles[pathname]) return pageTitles[pathname];

        // Check for partial matches (for dynamic routes like /menu/edit/123)
        if (pathname.startsWith('/menu/edit/')) return 'Edit Menu Item';
        if (pathname.startsWith('/staff/edit/')) return 'Edit Staff Member';

        // Check for base path matches (e.g., /menu/something -> Menu Management)
        for (const [path, pageTitle] of Object.entries(pageTitles)) {
            if (pathname.startsWith(path + '/')) return pageTitle;
        }

        // Default fallback
        return 'Dashboard';
    };

    const pageTitle = getPageTitle();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className={styles.mobileOverlay} onClick={closeSidebar} />
            )}

            {/* Sidebar Navigation */}
            <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content Area */}
            <div className={styles.mainArea}>
                {/* Header */}
                <Header title={pageTitle} onMenuClick={toggleSidebar} />

                {/* Page Content */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}

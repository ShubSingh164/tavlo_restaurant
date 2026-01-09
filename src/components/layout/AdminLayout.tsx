/**
 * Tavlo Restaurant ERP - Admin Layout Wrapper
 * 
 * Main layout component that wraps all admin pages.
 * Includes the sidebar and header.
 * 
 * @component AdminLayout
 * @usage Wrap admin pages with this layout
 */

import React from 'react';
import AdminSidebar from './Sidebar';
import Header from './Header';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

/**
 * AdminLayout - wraps admin pages with sidebar and header
 * @param children - Page content
 * @param title - Page title displayed in header
 */
export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
    return (
        <div className={styles.adminLayout}>
            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className={styles.mainArea}>
                {/* Header */}
                <Header title={title} />

                {/* Page Content */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}

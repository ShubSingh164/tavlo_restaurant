'use client';

/**
 * Tavlo Restaurant ERP - Staff Management Page
 * 
 * Comprehensive staff management for restaurant owners:
 * - Staff directory with photos, roles, contact info
 * - Status tracking (On Duty, On Break, Off Duty)
 * - Performance metrics per employee
 * - Role-based filtering
 * - Shift scheduling overview
 * 
 * @component StaffPage
 * @route /staff
 * @backend CRUD operations on staff/users collection
 * @api GET /api/staff - Fetch all staff members
 * @api POST /api/staff - Create new staff member
 * @api PUT /api/staff/:id - Update staff member
 * @api DELETE /api/staff/:id - Remove staff member
 */

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout';
import { mockStaff } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const MoreIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const GridIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ListIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

// ============================================================================
// STAFF ROLE CONFIGURATION
// ============================================================================

const staffRoles = [
    { id: 'all', label: 'All Staff', count: 0 },
    { id: 'chef', label: 'Chefs', count: 0 },
    { id: 'waiter', label: 'Waiters', count: 0 },
    { id: 'manager', label: 'Managers', count: 0 },
    { id: 'cashier', label: 'Cashiers', count: 0 },
];

// ============================================================================
// STAFF STATS COMPONENT
// ============================================================================

function StaffStats() {
    const totalStaff = mockStaff.length;
    const onDuty = mockStaff.filter(s => s.status === 'on-duty').length;
    const onBreak = mockStaff.filter(s => s.status === 'on-break').length;
    const offDuty = mockStaff.filter(s => s.status === 'off-duty').length;

    return (
        <div className={styles.statsRow}>
            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{totalStaff}</span>
                    <span className={styles.statLabel}>Total Staff</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{onDuty}</span>
                    <span className={styles.statLabel}>On Duty</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 010 8h-1M5 8H4a4 4 0 000 8h1" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{onBreak}</span>
                    <span className={styles.statLabel}>On Break</span>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{offDuty}</span>
                    <span className={styles.statLabel}>Off Duty</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STAFF CARD COMPONENT
// ============================================================================

interface StaffCardProps {
    staff: typeof mockStaff[0];
    onEdit: (staff: typeof mockStaff[0]) => void;
    onDelete: (id: string) => void;
}

function StaffCard({ staff, onEdit, onDelete }: StaffCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-duty': return '#22c55e';
            case 'on-break': return '#f97316';
            case 'off-duty': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'on-duty': return 'On Duty';
            case 'on-break': return 'On Break';
            case 'off-duty': return 'Off Duty';
            default: return status;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'chef': return { bg: '#fef3c7', color: '#d97706' };
            case 'waiter': return { bg: '#dbeafe', color: '#2563eb' };
            case 'manager': return { bg: '#f3e8ff', color: '#9333ea' };
            case 'cashier': return { bg: '#dcfce7', color: '#16a34a' };
            default: return { bg: '#f3f4f6', color: '#6b7280' };
        }
    };

    const roleBadge = getRoleBadgeColor(staff.role);

    return (
        <div className={styles.staffCard}>
            {/* Header with avatar and status */}
            <div className={styles.cardHeader}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={staff.avatar || `https://ui-avatars.com/api/?name=${staff.name}&background=f97316&color=fff`}
                        alt={staff.name}
                        className={styles.avatar}
                    />
                    <span
                        className={styles.statusDot}
                        style={{ backgroundColor: getStatusColor(staff.status) }}
                    />
                </div>
                <div className={styles.menuWrapper}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreIcon />
                    </button>
                    {showMenu && (
                        <div className={styles.dropdown}>
                            <button onClick={() => { onEdit(staff); setShowMenu(false); }}>Edit Profile</button>
                            <button onClick={() => setShowMenu(false)}>View Schedule</button>
                            <button onClick={() => setShowMenu(false)}>Send Message</button>
                            <button
                                className={styles.dangerItem}
                                onClick={() => { onDelete(staff._id || ''); setShowMenu(false); }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Staff Info */}
            <div className={styles.cardBody}>
                <h3 className={styles.staffName}>{staff.name}</h3>
                <span
                    className={styles.roleBadge}
                    style={{ backgroundColor: roleBadge.bg, color: roleBadge.color }}
                >
                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                </span>
                <span className={styles.statusLabel} style={{ color: getStatusColor(staff.status) }}>
                    {getStatusLabel(staff.status)}
                </span>
            </div>

            {/* Contact Info */}
            <div className={styles.cardContact}>
                <div className={styles.contactItem}>
                    <PhoneIcon />
                    <span>{staff.phone}</span>
                </div>
                <div className={styles.contactItem}>
                    <MailIcon />
                    <span>{staff.email}</span>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.cardStats}>
                <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{staff.ordersHandled}</span>
                    <span className={styles.cardStatLabel}>Orders</span>
                </div>
                <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{formatCurrency(staff.salesAmount)}</span>
                    <span className={styles.cardStatLabel}>Sales</span>
                </div>
                <div className={styles.cardStat}>
                    <span className={styles.cardStatValue}>{staff.rating.toFixed(1)}</span>
                    <span className={styles.cardStatLabel}>Rating</span>
                </div>
            </div>

            {/* Shift Info */}
            <div className={styles.cardShift}>
                <CalendarIcon />
                <span>Next Shift: {staff.shift}</span>
            </div>
        </div>
    );
}

// ============================================================================
// TODAY'S SHIFT SCHEDULE
// ============================================================================

function ShiftSchedule() {
    const shifts = [
        { time: '06:00 - 14:00', label: 'Morning', staff: ['Amit Kumar', 'Priya Singh'], color: '#f97316' },
        { time: '14:00 - 22:00', label: 'Afternoon', staff: ['Rahul Sharma', 'Neha Patel'], color: '#3b82f6' },
        { time: '22:00 - 06:00', label: 'Night', staff: ['Vikram Joshi'], color: '#8b5cf6' },
    ];

    return (
        <div className={styles.scheduleCard}>
            <div className={styles.scheduleHeader}>
                <h3 className={styles.cardTitle}>Today's Shift Schedule</h3>
                <button className={styles.viewAllBtn}>View Full Schedule</button>
            </div>
            <div className={styles.shiftList}>
                {shifts.map((shift, index) => (
                    <div key={index} className={styles.shiftItem}>
                        <div className={styles.shiftTime}>
                            <span className={styles.shiftDot} style={{ backgroundColor: shift.color }} />
                            <div>
                                <span className={styles.shiftLabel}>{shift.label}</span>
                                <span className={styles.shiftHours}>{shift.time}</span>
                            </div>
                        </div>
                        <div className={styles.shiftStaff}>
                            {shift.staff.map((name, i) => (
                                <span key={i} className={styles.shiftStaffName}>{name}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN STAFF PAGE
// ============================================================================

export default function StaffPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStaff = useMemo(() => {
        return mockStaff.filter(staff => {
            if (selectedRole !== 'all' && staff.role !== selectedRole) return false;
            if (searchQuery && !staff.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [selectedRole, searchQuery]);

    const handleEditStaff = (staff: typeof mockStaff[0]) => {
        console.log('Edit staff:', staff);
    };

    const handleDeleteStaff = (id: string) => {
        console.log('Delete staff:', id);
    };

    return (
        <AdminLayout title="Staff">
            <div className={styles.staffPage}>
                {/* Stats Overview */}
                <StaffStats />

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {/* Staff Directory */}
                    <div className={styles.directorySection}>
                        {/* Header */}
                        <div className={styles.sectionHeader}>
                            <div className={styles.headerLeft}>
                                <h2 className={styles.sectionTitle}>Staff Directory</h2>
                                <span className={styles.staffCount}>{filteredStaff.length} members</span>
                            </div>
                            <div className={styles.headerRight}>
                                <div className={styles.searchBox}>
                                    <SearchIcon />
                                    <input
                                        type="text"
                                        placeholder="Search staff..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className={styles.viewToggle}>
                                    <button
                                        className={view === 'grid' ? styles.active : ''}
                                        onClick={() => setView('grid')}
                                    >
                                        <GridIcon />
                                    </button>
                                    <button
                                        className={view === 'list' ? styles.active : ''}
                                        onClick={() => setView('list')}
                                    >
                                        <ListIcon />
                                    </button>
                                </div>
                                <button className={styles.addBtn}>
                                    <PlusIcon />
                                    <span>Add Staff</span>
                                </button>
                            </div>
                        </div>

                        {/* Role Filters */}
                        <div className={styles.roleFilters}>
                            {staffRoles.map(role => (
                                <button
                                    key={role.id}
                                    className={`${styles.roleFilter} ${selectedRole === role.id ? styles.active : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>

                        {/* Staff Grid */}
                        <div className={view === 'grid' ? styles.staffGrid : styles.staffList}>
                            {filteredStaff.map(staff => (
                                <StaffCard
                                    key={staff._id}
                                    staff={staff}
                                    onEdit={handleEditStaff}
                                    onDelete={handleDeleteStaff}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebarSection}>
                        <ShiftSchedule />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

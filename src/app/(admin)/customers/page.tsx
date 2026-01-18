'use client';

/**
 * Tavlo Restaurant ERP - Customers Page
 * 
 * Customer management with:
 * - Customer directory with search and filtering
 * - Customer profiles with order history
 * - Loyalty/points tracking
 * - Customer insights and analytics
 * 
 * @component CustomersPage
 * @route /customers
 */

import React, { useState, useMemo } from 'react';

import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

// Mock customer data
const mockCustomers = [
  {
    id: 'cust_001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    totalOrders: 45,
    totalSpent: 28500,
    lastVisit: '2026-01-08',
    loyaltyPoints: 2850,
    status: 'active',
    memberSince: '2024-03-15',
    preferredPayment: 'UPI',
    favoriteItems: ['Butter Chicken', 'Garlic Naan'],
  },
  {
    id: 'cust_002',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    totalOrders: 32,
    totalSpent: 19800,
    lastVisit: '2026-01-07',
    loyaltyPoints: 1980,
    status: 'active',
    memberSince: '2024-06-20',
    preferredPayment: 'Card',
    favoriteItems: ['Paneer Tikka', 'Dal Makhani'],
  },
  {
    id: 'cust_003',
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    totalOrders: 28,
    totalSpent: 15600,
    lastVisit: '2026-01-05',
    loyaltyPoints: 1560,
    status: 'active',
    memberSince: '2024-08-10',
    preferredPayment: 'Cash',
    favoriteItems: ['Hyderabadi Biryani'],
  },
  {
    id: 'cust_004',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@email.com',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    totalOrders: 18,
    totalSpent: 12400,
    lastVisit: '2026-01-03',
    loyaltyPoints: 1240,
    status: 'inactive',
    memberSince: '2024-11-05',
    preferredPayment: 'UPI',
    favoriteItems: ['Mango Lassi', 'Gulab Jamun'],
  },
  {
    id: 'cust_005',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    totalOrders: 52,
    totalSpent: 35200,
    lastVisit: '2026-01-09',
    loyaltyPoints: 3520,
    status: 'vip',
    memberSince: '2023-12-01',
    preferredPayment: 'Card',
    favoriteItems: ['Butter Chicken', 'Hyderabadi Biryani', 'Gulab Jamun'],
  },
  {
    id: 'cust_006',
    name: 'Neha Reddy',
    email: 'neha.reddy@email.com',
    phone: '+91 98765 43215',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    totalOrders: 15,
    totalSpent: 8900,
    lastVisit: '2025-12-28',
    loyaltyPoints: 890,
    status: 'active',
    memberSince: '2025-02-14',
    preferredPayment: 'UPI',
    favoriteItems: ['Masala Chai', 'Samosa'],
  },
];

// Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

// Stats Card
function StatsCard({ title, value, change, icon, color }: { title: string; value: string | number; change?: number; icon: React.ReactNode; color: string }) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsIcon} style={{ background: color }}>
        {icon}
      </div>
      <div className={styles.statsContent}>
        <span className={styles.statsValue}>{value}</span>
        <span className={styles.statsTitle}>{title}</span>
        {change !== undefined && (
          <span className={`${styles.statsChange} ${change >= 0 ? styles.positive : styles.negative}`}>
            {change >= 0 ? '+' : ''}{change}% vs last month
          </span>
        )}
      </div>
    </div>
  );
}

// Customer Row
function CustomerRow({ customer }: { customer: typeof mockCustomers[0] }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: '#dcfce7', color: '#16a34a', label: 'Active' },
      inactive: { bg: '#fef3c7', color: '#d97706', label: 'Inactive' },
      vip: { bg: '#f3e8ff', color: '#9333ea', label: 'VIP' },
    };
    return statusConfig[status] || statusConfig.active;
  };

  const status = getStatusBadge(customer.status);

  return (
    <tr className={styles.customerRow}>
      <td>
        <div className={styles.customerInfo}>
          <img src={customer.avatar} alt={customer.name} className={styles.customerAvatar} />
          <div>
            <span className={styles.customerName}>{customer.name}</span>
            <span className={styles.customerId}>ID: {customer.id}</span>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.contactInfo}>
          <span><MailIcon /> {customer.email}</span>
          <span><PhoneIcon /> {customer.phone}</span>
        </div>
      </td>
      <td>{customer.totalOrders}</td>
      <td>{formatCurrency(customer.totalSpent)}</td>
      <td>
        <div className={styles.loyaltyPoints}>
          <span className={styles.pointsValue}>{customer.loyaltyPoints}</span>
          <span className={styles.pointsLabel}>pts</span>
        </div>
      </td>
      <td>{new Date(customer.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
      <td>
        <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
          {status.label}
        </span>
      </td>
      <td>
        <div className={styles.actionCell}>
          <button className={styles.actionBtn} onClick={() => setShowMenu(!showMenu)}>
            <MoreIcon />
          </button>
          {showMenu && (
            <div className={styles.dropdown}>
              <button>View Profile</button>
              <button>Order History</button>
              <button>Send Message</button>
              <button className={styles.dangerItem}>Remove</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer => {
      if (statusFilter !== 'all' && customer.status !== statusFilter) return false;
      if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [searchQuery, statusFilter]);

  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const vipCustomers = mockCustomers.filter(c => c.status === 'vip').length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    
      <div className={styles.customersPage}>
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <StatsCard
            title="Total Customers"
            value={totalCustomers}
            change={12}
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>}
            color="linear-gradient(135deg, #3b82f6, #2563eb)"
          />
          <StatsCard
            title="Active Customers"
            value={activeCustomers}
            change={8}
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
            color="linear-gradient(135deg, #22c55e, #16a34a)"
          />
          <StatsCard
            title="VIP Members"
            value={vipCustomers}
            change={25}
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
            color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change={18}
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
            color="linear-gradient(135deg, #f97316, #ea580c)"
          />
        </div>

        {/* Customer Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.headerLeft}>
              <h2 className={styles.tableTitle}>Customer Directory</h2>
              <span className={styles.tableCount}>{filteredCustomers.length} customers</span>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.searchBox}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vip">VIP</option>
              </select>
              <button className={styles.addBtn}>
                <PlusIcon />
                Add Customer
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            {/* Desktop Table View */}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Points</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className={styles.mobileCards}>
              {filteredCustomers.map(customer => {
                const getStatusBadge = (status: string) => {
                  const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
                    active: { bg: '#dcfce7', color: '#16a34a', label: 'Active' },
                    inactive: { bg: '#fef3c7', color: '#d97706', label: 'Inactive' },
                    vip: { bg: '#f3e8ff', color: '#9333ea', label: 'VIP' },
                  };
                  return statusConfig[status] || statusConfig.active;
                };
                const status = getStatusBadge(customer.status);

                return (
                  <div key={customer.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardHeader}>
                      <div className={styles.customerInfo}>
                        <img src={customer.avatar} alt={customer.name} className={styles.customerAvatar} />
                        <div>
                          <span className={styles.customerName}>{customer.name}</span>
                          <span className={styles.customerId}>ID: {customer.id}</span>
                        </div>
                      </div>
                      <span className={styles.statusBadge} style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <div className={styles.mobileCardBody}>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileCardLabel}>Phone</span>
                        <span className={styles.mobileCardValue}>{customer.phone}</span>
                      </div>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileCardLabel}>Orders</span>
                        <span className={styles.mobileCardValue}>{customer.totalOrders}</span>
                      </div>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileCardLabel}>Total Spent</span>
                        <span className={styles.mobileCardValue}>{formatCurrency(customer.totalSpent)}</span>
                      </div>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileCardLabel}>Points</span>
                        <span className={styles.mobileCardValue} style={{ color: '#f97316' }}>{customer.loyaltyPoints} pts</span>
                      </div>
                    </div>
                    <div className={styles.mobileCardFooter}>
                      <span className={styles.mobileCardLabel}>
                        Last: {new Date(customer.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <button className={styles.actionBtn}>
                        <MoreIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    
  );
}

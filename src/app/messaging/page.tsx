'use client';

/**
 * Tavlo Restaurant ERP - Messaging Page
 * 
 * Communication center with:
 * - Customer messages
 * - Staff notifications
 * - Broadcast messages
 * - Message templates
 * 
 * @component MessagingPage
 * @route /messaging
 */

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import styles from './page.module.css';

// Mock conversations
const mockConversations = [
    {
        id: 'conv_001',
        type: 'customer',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        lastMessage: 'Thank you for the wonderful service!',
        time: '10 min ago',
        unread: 2,
        status: 'online',
    },
    {
        id: 'conv_002',
        type: 'customer',
        name: 'Priya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        lastMessage: 'Is my order ready for pickup?',
        time: '25 min ago',
        unread: 1,
        status: 'online',
    },
    {
        id: 'conv_003',
        type: 'staff',
        name: 'Kitchen Team',
        avatar: null,
        lastMessage: 'Table 5 order is ready',
        time: '1 hour ago',
        unread: 0,
        status: 'group',
    },
    {
        id: 'conv_004',
        type: 'customer',
        name: 'Amit Kumar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        lastMessage: 'Can I book a table for tomorrow evening?',
        time: '2 hours ago',
        unread: 0,
        status: 'offline',
    },
    {
        id: 'conv_005',
        type: 'staff',
        name: 'All Staff',
        avatar: null,
        lastMessage: 'Meeting at 4 PM today',
        time: 'Yesterday',
        unread: 0,
        status: 'group',
    },
];

// Mock templates
const messageTemplates = [
    { id: 't1', title: 'Order Ready', message: 'Hi! Your order #{orderId} is ready for pickup.' },
    { id: 't2', title: 'Reservation Confirmed', message: 'Your reservation for {date} at {time} is confirmed.' },
    { id: 't3', title: 'Feedback Request', message: 'Thank you for dining with us! Please share your feedback.' },
    { id: 't4', title: 'Special Offer', message: 'Exclusive offer just for you! Get {discount}% off on your next visit.' },
];

// Icons
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// Conversation Item
function ConversationItem({ conversation, isActive, onClick }: {
    conversation: typeof mockConversations[0];
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button className={`${styles.conversationItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
            <div className={styles.avatarWrapper}>
                {conversation.avatar ? (
                    <img src={conversation.avatar} alt={conversation.name} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {conversation.name.charAt(0)}
                    </div>
                )}
                {conversation.status === 'online' && <span className={styles.onlineDot} />}
            </div>
            <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                    <span className={styles.conversationName}>{conversation.name}</span>
                    <span className={styles.conversationTime}>{conversation.time}</span>
                </div>
                <div className={styles.conversationPreview}>
                    <span className={styles.lastMessage}>{conversation.lastMessage}</span>
                    {conversation.unread > 0 && (
                        <span className={styles.unreadBadge}>{conversation.unread}</span>
                    )}
                </div>
            </div>
        </button>
    );
}

export default function MessagingPage() {
    const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredConversations = mockConversations.filter(conv => {
        if (filter === 'customers' && conv.type !== 'customer') return false;
        if (filter === 'staff' && conv.type !== 'staff') return false;
        if (searchQuery && !conv.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

    return (
        <AdminLayout title="Messaging">
            <div className={styles.messagingPage}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Messages</h2>
                        {totalUnread > 0 && <span className={styles.totalUnread}>{totalUnread}</span>}
                        <button className={styles.newMessageBtn}>
                            <PlusIcon />
                        </button>
                    </div>

                    <div className={styles.searchBox}>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterTab} ${filter === 'customers' ? styles.active : ''}`}
                            onClick={() => setFilter('customers')}
                        >
                            Customers
                        </button>
                        <button
                            className={`${styles.filterTab} ${filter === 'staff' ? styles.active : ''}`}
                            onClick={() => setFilter('staff')}
                        >
                            Staff
                        </button>
                    </div>

                    <div className={styles.conversationsList}>
                        {filteredConversations.map(conv => (
                            <ConversationItem
                                key={conv.id}
                                conversation={conv}
                                isActive={activeConversation.id === conv.id}
                                onClick={() => setActiveConversation(conv)}
                            />
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderInfo}>
                            {activeConversation.avatar ? (
                                <img src={activeConversation.avatar} alt={activeConversation.name} className={styles.chatAvatar} />
                            ) : (
                                <div className={styles.chatAvatarPlaceholder}>
                                    {activeConversation.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <span className={styles.chatName}>{activeConversation.name}</span>
                                <span className={styles.chatStatus}>
                                    {activeConversation.status === 'online' ? 'Online' :
                                        activeConversation.status === 'group' ? 'Group Chat' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.chatActions}>
                            <button className={styles.iconBtn}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </button>
                            <button className={styles.iconBtn}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={styles.chatMessages}>
                        <div className={styles.emptyChat}>
                            <div className={styles.emptyChatIcon}>💬</div>
                            <p>Start a conversation with {activeConversation.name}</p>
                        </div>
                    </div>

                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <button className={styles.sendBtn}>
                            <SendIcon />
                        </button>
                    </div>
                </div>

                {/* Templates Sidebar */}
                <div className={styles.templatesSidebar}>
                    <h3 className={styles.templatesTitle}>Quick Templates</h3>
                    <div className={styles.templatesList}>
                        {messageTemplates.map(template => (
                            <button key={template.id} className={styles.templateItem}>
                                <span className={styles.templateName}>{template.title}</span>
                                <span className={styles.templatePreview}>{template.message}</span>
                            </button>
                        ))}
                    </div>
                    <button className={styles.manageTemplatesBtn}>Manage Templates</button>
                </div>
            </div>
        </AdminLayout>
    );
}

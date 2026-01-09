/**
 * Tavlo Restaurant ERP - Utility Functions
 * 
 * Common utility functions used throughout the application.
 * These are pure functions with no side effects.
 */

/**
 * Format currency value with Indian Rupee symbol
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: ₹)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // "₹1,234.56"
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
    return `${currency}${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "26 July 2025"
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }
): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', options);
}

/**
 * Format time to readable string
 * @param date - Date to extract time from
 * @returns Formatted time string (e.g., "02:15 PM")
 */
export function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format date and time together
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date to compare with current time
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(d);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated text
 */
export function truncateText(
    text: string,
    maxLength: number,
    suffix: string = '...'
): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate initials from name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 * 
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John") // "JO"
 */
export function getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a random ID (for local use only)
 * @backend Replace with MongoDB ObjectId in production
 * @param prefix - Optional prefix for the ID
 * @returns Generated ID string
 */
export function generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Slugify a string for URL use
 * @param text - Text to slugify
 * @returns URL-safe slug
 * 
 * @example
 * slugify("Butter Chicken") // "butter-chicken"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Classify number by combining suffixes (K, M, B)
 * @param num - Number to format
 * @returns Formatted number with suffix
 * 
 * @example
 * formatCompactNumber(1234567) // "1.2M"
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (positive or negative)
 */
export function calculatePercentageChange(
    current: number,
    previous: number
): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Debounce function for input handlers
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Classnames utility for conditional classes
 * @param classes - Object with class names as keys and booleans as values
 * @returns Combined class string
 * 
 * @example
 * cn({ 'active': true, 'disabled': false }) // "active"
 */
export function cn(
    ...classes: (string | Record<string, boolean> | undefined | null | false)[]
): string {
    return classes
        .flatMap((c) => {
            if (!c) return [];
            if (typeof c === 'string') return c;
            return Object.entries(c)
                .filter(([, v]) => v)
                .map(([k]) => k);
        })
        .join(' ');
}

/**
 * Get order status color class
 * @param status - Order status
 * @returns CSS class for the status badge
 */
export function getOrderStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
        pending: 'badge-warning',
        confirmed: 'badge-info',
        preparing: 'badge-warning',
        ready: 'badge-info',
        served: 'badge-success',
        completed: 'badge-success',
        cancelled: 'badge-error',
    };
    return statusClasses[status] || 'badge-info';
}

/**
 * Get order status display text
 * @param status - Order status
 * @returns Human-readable status text
 */
export function getOrderStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        served: 'Served',
        completed: 'Completed',
        cancelled: 'Cancelled',
    };
    return statusTexts[status] || status;
}

/**
 * Get table status color class
 * @param status - Table status
 * @returns CSS class for the status
 */
export function getTableStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
        available: 'badge-success',
        occupied: 'badge-error',
        reserved: 'badge-warning',
        cleaning: 'badge-info',
    };
    return statusClasses[status] || 'badge-info';
}

/**
 * Check if a menu item matches search query
 * @param item - Menu item to check
 * @param query - Search query
 * @returns True if item matches query
 */
export function matchesSearch(
    item: { name: string; description?: string; tags?: string[] },
    query: string
): boolean {
    const q = query.toLowerCase();
    return (
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        (item.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false)
    );
}

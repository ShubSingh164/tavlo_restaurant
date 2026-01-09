/**
 * Tavlo Restaurant ERP - TypeScript Type Definitions
 * 
 * These interfaces are designed to work seamlessly with MongoDB/Mongoose.
 * Each interface corresponds to a MongoDB collection.
 * 
 * @backend All interfaces include optional _id for MongoDB ObjectId
 * @backend Include createdAt/updatedAt for Mongoose timestamps
 * @backend Use these as the basis for Mongoose schemas
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

/**
 * User roles in the system
 * @backend Create enum in Mongoose schema
 */
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'customer';

/**
 * User status for account management
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * Base user interface for all user types
 * @backend MongoDB Collection: users
 * @mongoose Create User model with discriminator for different roles
 */
export interface IUser {
  _id?: string;
  email: string;
  password?: string; // Hashed, never sent to frontend
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  restaurantId?: string; // Reference to restaurant (for staff)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Staff member with additional work-related fields
 * @backend Extends IUser with staff-specific fields
 */
export interface IStaffMember extends IUser {
  employeeId: string;
  department: 'kitchen' | 'service' | 'management';
  salary?: number;
  joinDate: Date;
  permissions: string[];
}

// ============================================================================
// RESTAURANT TYPES
// ============================================================================

/**
 * Restaurant profile and settings
 * @backend MongoDB Collection: restaurants
 * @api GET /api/restaurants/:id - Fetch restaurant details
 * @api PUT /api/restaurants/:id - Update restaurant
 */
export interface IRestaurant {
  _id?: string;
  name: string;
  slug: string; // URL-friendly identifier
  logo?: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  settings: {
    currency: string;
    taxRate: number;
    serviceCharge: number;
    acceptsOnlinePayment: boolean;
  };
  ownerId: string; // Reference to owner user
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// MENU & CATEGORY TYPES
// ============================================================================

/**
 * Menu category (e.g., Starters, Main Course, Beverages)
 * @backend MongoDB Collection: categories
 * @api GET /api/categories - Fetch all categories
 * @api POST /api/categories - Create category
 */
export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // Icon name or image URL
  image?: string; // Category image
  displayOrder: number;
  isActive: boolean;
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Customization option for menu items (add-ons, variations)
 */
export interface ICustomizationOption {
  name: string;
  price: number;
  isDefault?: boolean;
}

/**
 * Customization group (e.g., Spice Level, Size, Extras)
 */
export interface ICustomizationGroup {
  name: string;
  type: 'single' | 'multiple'; // Radio vs Checkbox selection
  required: boolean;
  options: ICustomizationOption[];
}

/**
 * Menu item (dish, beverage, dessert)
 * @backend MongoDB Collection: menuItems
 * @api GET /api/menu - Fetch menu items with filters
 * @api POST /api/menu - Create menu item
 * @api PUT /api/menu/:id - Update menu item
 * @api DELETE /api/menu/:id - Delete menu item
 */
export interface IMenuItem {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  categoryId: string;
  tags: string[]; // e.g., 'veg', 'non-veg', 'spicy', 'bestseller'
  isVegetarian: boolean;
  isVegan?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  preparationTime: number; // in minutes
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  customizations?: ICustomizationGroup[];
  isAvailable: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// TABLE TYPES
// ============================================================================

/**
 * Table status for real-time tracking
 */
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

/**
 * Restaurant table with QR code
 * @backend MongoDB Collection: tables
 * @api GET /api/tables - Fetch all tables
 * @api POST /api/tables - Create table
 * @api PATCH /api/tables/:id/status - Update table status
 */
export interface ITable {
  _id?: string;
  tableNumber: string;
  name?: string; // e.g., "Window Table 1"
  capacity: number;
  status: TableStatus;
  qrCode: string; // QR code image URL or data
  qrCodeUrl: string; // URL that QR code redirects to
  section?: string; // e.g., "Indoor", "Outdoor", "Private"
  currentOrderId?: string; // Active order reference
  restaurantId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

/**
 * Order status flow
 * @backend Use this enum in Mongoose schema
 */
export type OrderStatus =
  | 'pending'      // Just placed
  | 'confirmed'    // Accepted by restaurant
  | 'preparing'    // In kitchen
  | 'ready'        // Ready for serving
  | 'served'       // Delivered to table
  | 'completed'    // Paid and closed
  | 'cancelled';   // Cancelled

/**
 * Order type
 */
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

/**
 * Payment status
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Individual item in an order
 */
export interface IOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: {
    groupName: string;
    selectedOptions: {
      name: string;
      price: number;
    }[];
  }[];
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  subtotal: number;
}

/**
 * Order document
 * @backend MongoDB Collection: orders
 * @api GET /api/orders - Fetch orders with filters
 * @api POST /api/orders - Create order (from customer menu)
 * @api PATCH /api/orders/:id - Update order status
 * @api GET /api/orders/stats - Get order statistics
 */
export interface IOrder {
  _id?: string;
  orderNumber: string; // Human-readable order ID (e.g., "#ORD-0001")
  billNumber?: string;
  tableId?: string;
  tableNumber?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  type: OrderType;
  status: OrderStatus;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  discountCode?: string;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet';
  paidAt?: Date;
  notes?: string;
  preparedBy?: string; // Chef user ID
  servedBy?: string; // Waiter user ID
  estimatedPrepTime?: number;
  actualPrepTime?: number;
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

/**
 * Payment transaction record
 * @backend MongoDB Collection: payments
 * @api GET /api/payments - Fetch payment history
 * @api POST /api/payments - Record payment
 */
export interface IPayment {
  _id?: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'wallet';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string; // From payment gateway
  gatewayResponse?: Record<string, unknown>;
  processedBy?: string; // Staff user ID
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

/**
 * Customer review/rating
 * @backend MongoDB Collection: reviews
 * @api GET /api/reviews - Fetch reviews
 * @api POST /api/reviews - Submit review
 */
export interface IReview {
  _id?: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  rating: number; // 1-5 stars
  comment?: string;
  menuItemId?: string; // If reviewing specific item
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: Date;
  };
  isPublished: boolean;
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// ANALYTICS TYPES (Frontend-only, computed from other collections)
// ============================================================================

/**
 * Dashboard KPI metrics
 * @backend Compute these from aggregation queries
 */
export interface IDashboardMetrics {
  todayRevenue: number;
  todayRevenueChange: number; // Percentage change from yesterday
  monthRevenue: number;
  monthRevenueChange: number;
  orderCount: number;
  orderCountChange: number;
  fiscalYearRevenue: number;
  fiscalYearChange: number;
  totalOrdersThisMonth: number;
  popularItems: {
    itemId: string;
    name: string;
    orderCount: number;
    revenue: number;
  }[];
  revenueByCategory: {
    categoryId: string;
    name: string;
    revenue: number;
    percentage: number;
  }[];
}

/**
 * Order statistics for charts
 */
export interface IOrderStats {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

// ============================================================================
// OFFER & COUPON TYPES
// ============================================================================

/**
 * Promotional offer or discount coupon
 * @backend MongoDB Collection: offers
 * @api GET /api/offers - Fetch active offers
 * @api POST /api/offers - Create offer
 */
export interface IOffer {
  _id?: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableItems?: string[];
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * System notification
 * @backend MongoDB Collection: notifications
 */
export interface INotification {
  _id?: string;
  userId: string;
  type: 'order' | 'payment' | 'review' | 'system' | 'alert';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  restaurantId: string;
  createdAt?: Date;
}

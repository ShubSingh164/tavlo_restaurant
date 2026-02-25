'use client';

/**
 * Tavlo - Cart Store (Zustand)
 * 
 * Client-side cart state management with localStorage persistence.
 * Used by the Customer Interface for managing order items.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface CartItemModifier {
    name: string;
    price: number;
}

export interface CartItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    modifiers?: CartItemModifier[];
    specialInstructions?: string;
}

interface CartState {
    items: CartItem[];
    tableId: string | null;

    // Actions
    setTableId: (tableId: string) => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (menuItemId: string) => void;
    updateQuantity: (menuItemId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;
    getTax: () => number;
    getTotal: () => number;
}

const TAX_RATE = 0.05; // 5% GST

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            tableId: null,

            setTableId: (tableId: string) => set({ tableId }),

            addItem: (item) => set((state) => {
                const existingIndex = state.items.findIndex(
                    (i) => i.menuItemId === item.menuItemId
                );

                if (existingIndex >= 0) {
                    // Item exists, increment quantity
                    const newItems = [...state.items];
                    newItems[existingIndex] = {
                        ...newItems[existingIndex],
                        quantity: newItems[existingIndex].quantity + 1,
                    };
                    return { items: newItems };
                }

                // New item
                return {
                    items: [...state.items, { ...item, quantity: 1 }]
                };
            }),

            removeItem: (menuItemId) => set((state) => ({
                items: state.items.filter((i) => i.menuItemId !== menuItemId),
            })),

            updateQuantity: (menuItemId, quantity) => set((state) => {
                if (quantity <= 0) {
                    return {
                        items: state.items.filter((i) => i.menuItemId !== menuItemId)
                    };
                }

                return {
                    items: state.items.map((i) =>
                        i.menuItemId === menuItemId ? { ...i, quantity } : i
                    ),
                };
            }),

            clearCart: () => set({ items: [], tableId: null }),

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((sum, item) => {
                    const modifiersTotal = item.modifiers?.reduce(
                        (m, mod) => m + mod.price, 0
                    ) || 0;
                    return sum + (item.price + modifiersTotal) * item.quantity;
                }, 0);
            },

            getTax: () => {
                return Math.round(get().getSubtotal() * TAX_RATE);
            },

            getTotal: () => {
                return get().getSubtotal() + get().getTax();
            },
        }),
        {
            name: 'tavlo-cart',
        }
    )
);

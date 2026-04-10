'use client';

/**
 * Tavlo - Waiter Store (Zustand)
 * 
 * Manages service requests from customers and order status overrides.
 * Persisted to localStorage so state survives page refreshes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ──────────────────────────────────────────────────────────────────

export type RequestType = 'call-waiter' | 'request-bill' | 'water-refill' | 'extra-cutlery' | 'table-cleanup';
export type RequestStatus = 'pending' | 'accepted' | 'done';

export interface ServiceRequest {
    id: string;
    tableId: string;
    tableNumber: string;
    type: RequestType;
    status: RequestStatus;
    timestamp: number; // Date.now()
}

export type ItemStatusOverride = 'pending' | 'preparing' | 'ready' | 'served';

export interface OrderItemOverride {
    orderId: string;
    menuItemId: string;
    status: ItemStatusOverride;
}

// ─── Store Interface ────────────────────────────────────────────────────────

interface WaiterState {
    requests: ServiceRequest[];
    orderOverrides: OrderItemOverride[];

    // Service Request Actions
    addRequest: (tableId: string, tableNumber: string, type: RequestType) => void;
    acceptRequest: (id: string) => void;
    completeRequest: (id: string) => void;
    clearDoneRequests: () => void;

    // Order Status Actions
    updateItemStatus: (orderId: string, menuItemId: string, status: ItemStatusOverride) => void;
    markOrderAllServed: (orderId: string, menuItemIds: string[]) => void;
    getItemStatus: (orderId: string, menuItemId: string, originalStatus: string) => ItemStatusOverride;

    // Computed
    getPendingCount: () => number;
    getActiveRequests: () => ServiceRequest[];
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useWaiterStore = create<WaiterState>()(
    persist(
        (set, get) => ({
            requests: [],
            orderOverrides: [],

            // ── Service Requests ────────────────────────────────────────

            addRequest: (tableId, tableNumber, type) => set((state) => ({
                requests: [
                    ...state.requests,
                    {
                        id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                        tableId,
                        tableNumber,
                        type,
                        status: 'pending' as RequestStatus,
                        timestamp: Date.now(),
                    },
                ],
            })),

            acceptRequest: (id) => set((state) => ({
                requests: state.requests.map((r) =>
                    r.id === id ? { ...r, status: 'accepted' as RequestStatus } : r
                ),
            })),

            completeRequest: (id) => set((state) => ({
                requests: state.requests.map((r) =>
                    r.id === id ? { ...r, status: 'done' as RequestStatus } : r
                ),
            })),

            clearDoneRequests: () => set((state) => ({
                requests: state.requests.filter((r) => r.status !== 'done'),
            })),

            // ── Order Status Overrides ──────────────────────────────────

            updateItemStatus: (orderId, menuItemId, status) => set((state) => {
                const existingIndex = state.orderOverrides.findIndex(
                    (o) => o.orderId === orderId && o.menuItemId === menuItemId
                );

                if (existingIndex >= 0) {
                    const newOverrides = [...state.orderOverrides];
                    newOverrides[existingIndex] = { orderId, menuItemId, status };
                    return { orderOverrides: newOverrides };
                }

                return {
                    orderOverrides: [...state.orderOverrides, { orderId, menuItemId, status }],
                };
            }),

            markOrderAllServed: (orderId, menuItemIds) => set((state) => {
                const otherOverrides = state.orderOverrides.filter(
                    (o) => o.orderId !== orderId
                );
                const newOverrides = menuItemIds.map((menuItemId) => ({
                    orderId,
                    menuItemId,
                    status: 'served' as ItemStatusOverride,
                }));
                return { orderOverrides: [...otherOverrides, ...newOverrides] };
            }),

            getItemStatus: (orderId, menuItemId, originalStatus) => {
                const override = get().orderOverrides.find(
                    (o) => o.orderId === orderId && o.menuItemId === menuItemId
                );
                return (override?.status || originalStatus) as ItemStatusOverride;
            },

            // ── Computed ────────────────────────────────────────────────

            getPendingCount: () => {
                return get().requests.filter((r) => r.status !== 'done').length;
            },

            getActiveRequests: () => {
                return get().requests.filter((r) => r.status !== 'done')
                    .sort((a, b) => b.timestamp - a.timestamp);
            },
        }),
        {
            name: 'tavlo-waiter',
        }
    )
);

/**
 * Tavlo - Orders API Route
 * 
 * POST /api/orders - Create a new order
 * GET /api/orders - Fetch orders by tableId
 * 
 * @backend Replace with MongoDB when ready
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

// In-memory order storage (replace with MongoDB)
const orders: Map<string, unknown> = new Map();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tableId, items, customerName, customerPhone } = body;

        if (!tableId || !items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce(
            (sum: number, item: { price: number; quantity: number }) =>
                sum + item.price * item.quantity,
            0
        );
        const tax = Math.round(subtotal * 0.05); // 5% GST
        const total = subtotal + tax;

        // Create order
        const orderId = generateId('ORD');
        const orderNumber = `#${orderId.slice(-6).toUpperCase()}`;

        const order = {
            _id: orderId,
            orderNumber,
            tableId,
            tableNumber: tableId,
            customerName: customerName || 'Guest',
            customerPhone: customerPhone || '',
            type: 'dine-in',
            status: 'pending',
            items: items.map((item: { menuItemId: string; name: string; price: number; quantity: number }) => ({
                ...item,
                status: 'pending',
                subtotal: item.price * item.quantity,
            })),
            subtotal,
            tax,
            serviceCharge: 0,
            discount: 0,
            total,
            paymentStatus: 'pending',
            restaurantId: 'rest_001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Store order (in-memory for now)
        orders.set(orderId, order);

        return NextResponse.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Orders API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tableId = searchParams.get('tableId');
        const orderId = searchParams.get('orderId');

        if (orderId) {
            const order = orders.get(orderId);
            if (!order) {
                return NextResponse.json(
                    { success: false, error: 'Order not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: order });
        }

        // Filter by tableId
        const allOrders = Array.from(orders.values());
        const filteredOrders = tableId
            ? allOrders.filter((o: unknown) => (o as { tableId: string }).tableId === tableId)
            : allOrders;

        return NextResponse.json({
            success: true,
            data: filteredOrders,
        });
    } catch (error) {
        console.error('Orders API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

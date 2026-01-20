/**
 * Tavlo - Menu API Route
 * 
 * GET /api/menu - Fetch all menu items with optional category filter
 * 
 * @backend Replace mockMenuItems with MongoDB query when ready
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockMenuItems, mockCategories } from '@/data/mock-data';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const search = searchParams.get('search');

        let items = mockMenuItems.filter((item) => item.isAvailable);

        // Filter by category
        if (categoryId && categoryId !== 'all') {
            items = items.filter((item) => item.categoryId === categoryId);
        }

        // Search filter
        if (search) {
            const query = search.toLowerCase();
            items = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                items,
                categories: mockCategories.filter((c) => c.isActive),
            },
        });
    } catch (error) {
        console.error('Menu API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
}

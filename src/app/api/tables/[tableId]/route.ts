/**
 * Tavlo - Table Validation API Route
 * 
 * GET /api/tables/[tableId] - Validate table and get info
 * 
 * @backend Replace with MongoDB when ready
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockTables } from '@/data/mock-data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tableId: string }> }
) {
    try {
        const { tableId } = await params;

        // Find table (mock data for now)
        const table = mockTables?.find(
            (t) => t.tableNumber === tableId || t._id === tableId
        );

        if (!table) {
            // For demo purposes, create a virtual table
            return NextResponse.json({
                success: true,
                data: {
                    _id: `table_${tableId}`,
                    tableNumber: tableId,
                    name: `Table ${tableId}`,
                    capacity: 4,
                    status: 'available',
                    isActive: true,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: table,
        });
    } catch (error) {
        console.error('Tables API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch table' },
            { status: 500 }
        );
    }
}

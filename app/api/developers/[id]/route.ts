import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/developers/:id — get a single developer
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const developer = await prisma.developer.findUnique({
            where: { id },
        });

        if (!developer) {
            return NextResponse.json(
                { error: 'Developer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(developer);
    } catch (error) {
        console.error('Error fetching developer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch developer' },
            { status: 500 }
        );
    }
}

// DELETE /api/developers/:id — delete a developer entry
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.developer.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Developer deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting developer:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: string }).code === 'P2025'
        ) {
            return NextResponse.json(
                { error: 'Developer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to delete developer' },
            { status: 500 }
        );
    }
}

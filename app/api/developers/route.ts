import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/developers — list all developers, optional ?search= query
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const developers = await prisma.developer.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(developers);
    } catch (error) {
        console.error('Error fetching developers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch developers' },
            { status: 500 }
        );
    }
}

// POST /api/developers — create a new developer entry
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, email, role, bio, skills, portfolioUrl, githubUrl, linkedinUrl, experience, location } = body;

        // Basic validation
        if (!name || !email || !role || !bio || !experience) {
            return NextResponse.json(
                { error: 'Name, email, role, bio, and experience are required.' },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format.' },
                { status: 400 }
            );
        }

        const developer = await prisma.developer.create({
            data: {
                name,
                email,
                role,
                bio,
                skills: skills || [],
                portfolioUrl: portfolioUrl || null,
                githubUrl: githubUrl || null,
                linkedinUrl: linkedinUrl || null,
                experience,
                location: location || null,
            },
        });

        return NextResponse.json(developer, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating developer:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: string }).code === 'P2002'
        ) {
            return NextResponse.json(
                { error: 'A developer with this email already exists.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create developer entry.' },
            { status: 500 }
        );
    }
}

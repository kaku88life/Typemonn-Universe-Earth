'use server';

import { prisma } from '@/lib/prisma';

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany();
        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

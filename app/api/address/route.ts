import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    // Get the first profile which contains address data
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return errorResponse('Address not found', 404);
    }

    // Return address data in the expected format
    const formatted = {
      id: profile.id,
      address: profile.address,
      lat: profile.lat,
      lng: profile.lng,
      mapURL: profile.mapURL,
    };

    return successResponse(formatted, 'Address fetched successfully');
  } catch (error) {
    console.error('Address API Error:', error);
    return errorResponse('Failed to fetch address', 500, error as Error);
  }
}

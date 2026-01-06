
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";;

export async function GET() {
  try {
    // Get the first profile which contains address data
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // Return address data in the expected format
    const formatted = {
      id: profile.id,
      address: profile.address,
      lat: profile.lat,
      lng: profile.lng,
      mapURL: profile.mapURL,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Address API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { facilityId, rating, title, body: reviewBody, vehicleType, storageType } = body;

    if (!facilityId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "facilityId and rating (1-5) are required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        facilityId,
        userId: session.user.id,
        rating,
        title: title || null,
        body: reviewBody || null,
        vehicleType: vehicleType || null,
        storageType: storageType || null,
      },
    });

    // Update facility average rating
    const aggregation = await prisma.review.aggregate({
      where: { facilityId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.facility.update({
      where: { id: facilityId },
      data: {
        avgRating: aggregation._avg.rating || 0,
        reviewCount: aggregation._count.rating,
      },
    });

    return NextResponse.json({ success: true, id: review.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const facilityId = searchParams.get("facilityId");

  if (!facilityId) {
    return NextResponse.json(
      { error: "facilityId is required" },
      { status: 400 }
    );
  }

  const reviews = await prisma.review.findMany({
    where: { facilityId },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(reviews);
}

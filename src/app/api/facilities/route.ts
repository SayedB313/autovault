import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const skip = (page - 1) * limit;

  const state = searchParams.get("state");
  const city = searchParams.get("city");
  const tier = searchParams.get("tier");
  const featured = searchParams.get("featured") === "true";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (state) where.state = state;
  if (city) where.city = city;
  if (tier) where.tier = tier;
  if (featured) where.tier = "PREMIUM";

  const [facilities, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      include: {
        photos: {
          orderBy: { order: "asc" },
          take: 3,
        },
      },
      orderBy: [
        { tier: "desc" },
        { avgRating: "desc" },
      ],
      skip,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  return NextResponse.json({
    facilities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

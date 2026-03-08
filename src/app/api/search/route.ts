import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  StorageType,
  VehicleType,
  Amenity,
  FacilityTier,
  Prisma,
} from "@/generated/prisma";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const q = searchParams.get("q") || undefined;
  const state = searchParams.get("state") || undefined;
  const city = searchParams.get("city") || undefined;
  const storageTypeParam = searchParams.get("storageType") || undefined;
  const vehicleTypeParam = searchParams.get("vehicleType") || undefined;
  const amenityParam = searchParams.get("amenity") || undefined;
  const tierParam = searchParams.get("tier") || undefined;
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const storageTypes = storageTypeParam
    ? (storageTypeParam.split(",").filter((v) => v in StorageType) as StorageType[])
    : [];
  const vehicleTypes = vehicleTypeParam
    ? (vehicleTypeParam.split(",").filter((v) => v in VehicleType) as VehicleType[])
    : [];
  const amenities = amenityParam
    ? (amenityParam.split(",").filter((v) => v in Amenity) as Amenity[])
    : [];
  const tiers = tierParam
    ? (tierParam.split(",").filter((v) => v in FacilityTier) as FacilityTier[])
    : [];
  const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

  const where: Prisma.FacilityWhereInput = {};

  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (state) {
    where.state = { equals: state, mode: "insensitive" };
  }
  if (city) {
    where.city = { equals: city, mode: "insensitive" };
  }
  if (storageTypes.length > 0) {
    where.storageTypes = { hasSome: storageTypes };
  }
  if (vehicleTypes.length > 0) {
    where.vehicleTypes = { hasSome: vehicleTypes };
  }
  if (amenities.length > 0) {
    where.amenities = { hasSome: amenities };
  }
  if (tiers.length > 0) {
    where.tier = { in: tiers };
  }
  if (minPrice !== undefined) {
    where.priceRangeMin = { gte: minPrice };
  }
  if (maxPrice !== undefined) {
    where.priceRangeMax = { lte: maxPrice };
  }

  let orderBy: Prisma.FacilityOrderByWithRelationInput = {};
  switch (sort) {
    case "rating_desc":
      orderBy = { avgRating: "desc" };
      break;
    case "price_asc":
      orderBy = { priceRangeMin: { sort: "asc", nulls: "last" } };
      break;
    case "price_desc":
      orderBy = { priceRangeMax: { sort: "desc", nulls: "last" } };
      break;
    case "reviews_desc":
      orderBy = { reviewCount: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { avgRating: "desc" };
      break;
  }

  try {
    const [facilities, totalCount] = await Promise.all([
      prisma.facility.findMany({
        where,
        include: { photos: { orderBy: { order: "asc" }, take: 1 } },
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.facility.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return NextResponse.json({
      facilities,
      pagination: {
        page,
        totalPages,
        totalCount,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search facilities" },
      { status: 500 }
    );
  }
}

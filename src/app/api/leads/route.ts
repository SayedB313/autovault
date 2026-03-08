import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { VehicleType } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityId, name, email, phone, message, vehicleType } = body;

    if (!facilityId || !name || !email) {
      return NextResponse.json(
        { error: "facilityId, name, and email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      select: { id: true },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    const validVehicleType =
      vehicleType && vehicleType in VehicleType
        ? (vehicleType as VehicleType)
        : null;

    const lead = await prisma.lead.create({
      data: {
        facilityId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        message: message ? String(message).trim() : null,
        vehicleType: validVehicleType,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

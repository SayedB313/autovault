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
    const { facilityId, role, phone, notes } = body;

    if (!facilityId) {
      return NextResponse.json(
        { error: "facilityId is required" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    }

    if (facility.claimedById) {
      return NextResponse.json(
        { error: "Facility already claimed" },
        { status: 409 }
      );
    }

    // For MVP, auto-approve claims (in production, add admin review queue)
    await prisma.facility.update({
      where: { id: facilityId },
      data: { claimedById: session.user.id },
    });

    // Update user role to OWNER
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "OWNER" },
    });

    // Log the claim details (for admin review later)
    console.log("Facility claimed:", {
      facilityId,
      userId: session.user.id,
      role,
      phone,
      notes,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json(
      { error: "Failed to process claim" },
      { status: 500 }
    );
  }
}

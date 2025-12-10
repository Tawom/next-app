import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tour from "@/models/Tour";
import { isAdmin } from "@/lib/isAdmin";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const tours = await Tour.find().sort({ createdAt: -1 });

    return NextResponse.json({ tours });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();

    const tour = await Tour.create(body);

    return NextResponse.json({ tour }, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create tour",
      },
      { status: 400 }
    );
  }
}

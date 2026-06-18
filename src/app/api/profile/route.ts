import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
// import { User } from "@/model/User";
import User from "@/model/User";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access attempt" },
        { status: 401 },
      );
    }

    // Query full document based on session identity, excluding the password field
    const userProfile = await User.findById(session.user._id)
      .select("-password")
      .lean();

    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: "User profile context not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: userProfile },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server data retrieval failure",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

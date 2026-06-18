import dbConnect from "@/lib/dbConnect";
import Feedback from "@/model/Feedback";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { message } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Feedback message cannot be empty" },
        { status: 400 },
      );
    }

    const newFeedback = await Feedback.create({ message });

    return NextResponse.json(
      { success: true, data: newFeedback },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Feedback Submission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

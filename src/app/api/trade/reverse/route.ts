import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

import { ShareRecord } from "../../../../model/Record";
import { UserLedger } from "@/model/UserLedger";
import { CompanyHolding } from "@/model/CompanyHolding";

// Utility to ensure perfect financial precision
const roundToTwo = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

// Strict validation schema for the incoming payload
const ReversePayloadSchema = z.object({
  transactionId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid transaction ID format.",
    }),
});

export async function POST(req: Request) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Authentication & Authorization Check
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 },
      );
    }

    // Safely parse JSON body
    let rawBody;
    try {
      rawBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON format sent to server." },
        { status: 400 },
      );
    }

    // Validate payload with Zod
    const validationResult = ReversePayloadSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors[0].message },
        { status: 400 },
      );
    }

    const { transactionId } = validationResult.data;

    // 2. Fetch the Original Transaction
    const originalRecord =
      await ShareRecord.findById(transactionId).session(session);

    if (!originalRecord) {
      return NextResponse.json(
        { success: false, message: "Transaction record not found." },
        { status: 404 },
      );
    }

    if (originalRecord.isReversed) {
      return NextResponse.json(
        {
          success: false,
          message: "This transaction has already been reversed.",
        },
        { status: 400 },
      );
    }

    const userId = originalRecord.userId;

    // Fetch User's Ledger
    const ledger = await UserLedger.findOne({ userId }).session(session);
    if (!ledger) {
      throw new Error("User ledger not found. Cannot perform reversal.");
    }

    // Initialize Holding variable
    let holding = null;
    if (
      ["BUY", "SELL"].includes(originalRecord.actionType) &&
      originalRecord.companyName
    ) {
      holding = await CompanyHolding.findOne({
        userId,
        companyName: originalRecord.companyName,
      }).session(session);

      if (!holding && originalRecord.actionType === "BUY") {
        throw new Error(
          "Holding record missing. Cannot reverse a BUY order if the holding no longer exists.",
        );
      }
    }

    // 3. Execute the Reversal Math based on Action Type
    const action = originalRecord.actionType;

    // ==========================================
    // 🟢 REVERSE A DEPOSIT
    // ==========================================
    if (action === "DEPOSIT") {
      if (ledger.cashBalance < originalRecord.grossAmount) {
        throw new Error(
          "Cannot reverse deposit: User does not have sufficient funds to cover the reversal.",
        );
      }
      ledger.cashBalance = roundToTwo(
        ledger.cashBalance - originalRecord.grossAmount,
      );
    }

    // ==========================================
    // 🟢 REVERSE A WITHDRAW
    // ==========================================
    else if (action === "WITHDRAW") {
      ledger.cashBalance = roundToTwo(
        ledger.cashBalance + originalRecord.grossAmount,
      );
    }

    // ==========================================
    // 🟢 REVERSE A BUY
    // ==========================================
    else if (action === "BUY" && holding) {
      ledger.cashBalance = roundToTwo(
        ledger.cashBalance - originalRecord.netCashImpact,
      );
      ledger.totalBuyVolume = roundToTwo(
        ledger.totalBuyVolume - originalRecord.grossAmount,
      );
      ledger.totalCommissionPaid = roundToTwo(
        ledger.totalCommissionPaid - originalRecord.commissionAmount,
      );

      if (holding.totalQuantity < (originalRecord.quantity || 0)) {
        throw new Error(
          "Cannot reverse BUY: User has already sold some of these shares.",
        );
      }

      const costOfOriginalBuy = roundToTwo(
        originalRecord.grossAmount + originalRecord.commissionAmount,
      );

      holding.totalQuantity -= originalRecord.quantity || 0;
      holding.totalInvestedAmount = roundToTwo(
        holding.totalInvestedAmount - costOfOriginalBuy,
      );

      if (holding.totalQuantity === 0) {
        holding.avgBuyPrice = 0;
        holding.totalInvestedAmount = 0;
      } else {
        holding.avgBuyPrice = roundToTwo(
          holding.totalInvestedAmount / holding.totalQuantity,
        );
      }
    }

    // ==========================================
    // 🟢 REVERSE A SELL
    // ==========================================
    else if (action === "SELL") {
      if (ledger.cashBalance < originalRecord.netCashImpact) {
        throw new Error(
          "Cannot reverse SELL: User does not have sufficient funds to return the cash.",
        );
      }

      ledger.cashBalance = roundToTwo(
        ledger.cashBalance - originalRecord.netCashImpact,
      );
      ledger.totalSellVolume = roundToTwo(
        ledger.totalSellVolume - originalRecord.grossAmount,
      );
      ledger.totalCommissionPaid = roundToTwo(
        ledger.totalCommissionPaid - originalRecord.commissionAmount,
      );

      if (!holding) {
        holding = new CompanyHolding({
          userId,
          companyName: originalRecord.companyName,
          totalQuantity: 0,
          totalInvestedAmount: 0,
          avgBuyPrice: 0,
          realizedProfit: 0,
        });
      }

      const proportionateCostBasis = roundToTwo(
        (originalRecord.quantity || 0) * holding.avgBuyPrice,
      );
      const realizedProfitFromThisSell = roundToTwo(
        originalRecord.netCashImpact - proportionateCostBasis,
      );

      holding.totalQuantity += originalRecord.quantity || 0;
      holding.totalInvestedAmount = roundToTwo(
        holding.totalInvestedAmount + proportionateCostBasis,
      );
      holding.realizedProfit = roundToTwo(
        holding.realizedProfit - realizedProfitFromThisSell,
      );
    }

    // 4. Save Updates
    await ledger.save({ session });
    if (holding) await holding.save({ session });

    // 5. Mark Original as Reversed
    originalRecord.isReversed = true;
    await originalRecord.save({ session });

    // 6. Create the Anti-Transaction Record (The Audit Trail)
    await ShareRecord.create(
      [
        {
          userId: originalRecord.userId,
          actionType: originalRecord.actionType,
          companyName: originalRecord.companyName,
          quantity: originalRecord.quantity
            ? -originalRecord.quantity
            : undefined,
          rate: originalRecord.rate,
          grossAmount: -originalRecord.grossAmount,
          commissionAmount: -originalRecord.commissionAmount,
          netCashImpact: -originalRecord.netCashImpact,
          status: "CANCELLED", // Marking the compensating entry
          isReversed: true,
          reversedReferenceId: originalRecord._id, // LINK TO ORIGINAL
          transactionDate: new Date(),
        },
      ],
      { session },
    );

    // 7. Commit Transaction
    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      message: `Transaction successfully reversed.`,
    });
  } catch (error: unknown) {
    // Safely narrow the unknown error
    await session.abortTransaction();

    let errorMessage = "Internal server error during transaction reversal.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Reversal Error:", errorMessage);

    const isBusinessError =
      errorMessage.includes("Cannot reverse") ||
      errorMessage.includes("not found");

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: isBusinessError ? 400 : 500 },
    );
  } finally {
    session.endSession();
  }
}

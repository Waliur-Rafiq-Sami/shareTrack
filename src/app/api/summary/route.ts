import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

import { UserLedger, IUserLedger } from "@/model/UserLedger";
import { CompanyHolding, ICompanyHolding } from "@/model/CompanyHolding";
import { IShareRecord, ShareRecord } from "../../../model/Record";

// --- 🌐 Pure Client/UI DTO Interfaces (No Mongoose Bloat) ---
export interface IDashboardOverview {
  netWorth: number;
  cashBalance: number;
  portfolioValueAtCost: number;
  totalRealizedProfit: number;
}

export interface IAnalytics {
  totalBuyVolume: number;
  totalSellVolume: number;
  totalCommissionPaid: number;
}

export interface IFunding {
  totalDeposited: number;
  totalWithdrawn: number;
}

// ফ্রন্টএন্ডের জন্য পিওর স্ট্রিং-বেসড ইন্টারফেস
export interface IActiveHoldingClient {
  _id: string;
  userId: string;
  companyName: string;
  totalQuantity: number;
  avgBuyPrice: number;
  totalInvestedAmount: number;
  realizedProfit: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRecentTransactionClient {
  _id: string;
  userId: string;
  actionType: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  companyName?: string;
  quantity?: number;
  rate?: number;
  grossAmount: number;
  commissionAmount: number;
  netCashImpact: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  transactionDate: string;
  createdAt: string;
}

// এন্টারপ্রাইজ পেলোড ডিটো (DTO)
export interface IDashboardPayload {
  overview: IDashboardOverview;
  analytics: IAnalytics;
  funding: IFunding;
  activeHoldings: IActiveHoldingClient[]; // 💡 เปลี่ยนจาก Mongoose Type เป็น Client Type
  recentTransactions: IRecentTransactionClient[]; // 💡 เปลี่ยนจาก Mongoose Type เป็น Client Type
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };

type FundingStat = {
  _id: "DEPOSIT" | "WITHDRAW";
  totalAmount: number;
};

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export async function GET(): Promise<
  NextResponse<ApiResponse<IDashboardPayload>>
> {
  await dbConnect();

  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(authSession.user._id as string);

    const [
      ledger,
      activeHoldings,
      realizedProfitResult,
      fundingStats,
      recentTransactions,
    ] = await Promise.all([
      UserLedger.findOne({ userId }).lean<IUserLedger>(),

      CompanyHolding.find({ userId, totalQuantity: { $gt: 0 } })
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean<ICompanyHolding[]>(),

      CompanyHolding.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalProfit: { $sum: "$realizedProfit" } } },
      ]),
      ShareRecord.aggregate<FundingStat>([
        {
          $match: {
            userId,
            actionType: { $in: ["DEPOSIT", "WITHDRAW"] },
            isReversed: false,
            status: "COMPLETED",
          },
        },
        {
          $group: {
            _id: "$actionType",
            totalAmount: { $sum: "$grossAmount" },
          },
        },
      ]),
      ShareRecord.find({ userId })
        .sort({ transactionDate: -1 })
        .limit(10)
        .select("-__v -updatedAt")
        .lean<IShareRecord[]>(),
    ]);

    const ledgerData = ledger || {
      cashBalance: 0,
      totalBuyVolume: 0,
      totalSellVolume: 0,
      totalCommissionPaid: 0,
    };

    const totalInvestedPortfolioValue = activeHoldings.reduce(
      (sum, holding) => sum + (holding.totalInvestedAmount || 0),
      0,
    );

    const totalRealizedProfit = realizedProfitResult[0]?.totalProfit || 0;

    const fundingMap = { DEPOSIT: 0, WITHDRAW: 0 };
    fundingStats.forEach((stat) => {
      if (stat._id === "DEPOSIT" || stat._id === "WITHDRAW") {
        network: fundingMap[stat._id] = stat.totalAmount;
      }
    });

    const serializedHoldings =
      activeHoldings as unknown as IActiveHoldingClient[];
    const serializedTransactions =
      recentTransactions as unknown as IRecentTransactionClient[];

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          netWorth: round(ledgerData.cashBalance + totalInvestedPortfolioValue),
          cashBalance: round(ledgerData.cashBalance),
          portfolioValueAtCost: round(totalInvestedPortfolioValue),
          totalRealizedProfit: round(totalRealizedProfit),
        },
        analytics: {
          totalBuyVolume: round(ledgerData.totalBuyVolume),
          totalSellVolume: round(ledgerData.totalSellVolume),
          totalCommissionPaid: round(ledgerData.totalCommissionPaid),
        },
        funding: {
          totalDeposited: round(fundingMap.DEPOSIT),
          totalWithdrawn: round(fundingMap.WITHDRAW),
        },
        activeHoldings: serializedHoldings,
        recentTransactions: serializedTransactions,
      },
    });
  } catch (error) {
    console.error("Dashboard API Critical Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

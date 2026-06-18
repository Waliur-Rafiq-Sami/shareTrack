"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpNarrowWide,
  DollarSign,
} from "lucide-react";
import { TableCell, TableRow as ShadcnTableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AssetDetailsModal } from "./modal/AssetDetailsModal";
import { cn } from "@/lib/utils";
import { SellAssetModal } from "./modal/SellAssetModal";

export interface HoldingData {
  _id: string;
  companyName: string;
  totalQuantity: number;
  avgBuyPrice: number;
  totalInvestedAmount: number;
  realizedProfit: number;
  lastUpdated: string;
  createdAt: string;
}

interface TableRowProps {
  holding: HoldingData;
}

export function TableRow({ holding }: TableRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isProfitable = holding.realizedProfit >= 0;
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(holding.lastUpdated));

  // Calculations
  const grossValue = holding.totalQuantity * holding.avgBuyPrice;
  const derivedCommission = Math.max(
    0,
    holding.totalInvestedAmount - grossValue,
  );

  // Calculate Commission % based on the Gross Trade Value
  const commissionPercentage =
    grossValue > 0 ? (derivedCommission / grossValue) * 100 : 0;

  return (
    <>
      <ShadcnTableRow
        className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <TableCell className="text-sm text-slate-500 dark:text-slate-400">
          {formattedDate}
        </TableCell>
        <TableCell className="text-blue-500 font-bold text-sm">
          <p className="flex items-center gap-1">
            {holding.companyName}
            <ArrowUpNarrowWide className="w-4 h-4" />
          </p>
        </TableCell>
        <TableCell className="text-right font-mono text-sm">
          {holding.totalQuantity.toLocaleString()}
        </TableCell>
        <TableCell className="text-right font-mono text-sm">
          ৳{holding.avgBuyPrice.toFixed(2)}
        </TableCell>

        {/* COMMISSION COLUMN (Fixed order) */}
        {/* <TableCell className="text-right font-mono text-sm text-slate-500 dark:text-slate-400">
          {commissionPercentage.toFixed(1)}% / ৳
          {derivedCommission.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </TableCell> */}

        {/* TOTAL INVESTED COLUMN (Fixed order) */}
        <TableCell className="text-right font-mono text-sm font-medium">
          ৳
          {holding.totalInvestedAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </TableCell>

        {/* Realized Profit */}
        <TableCell className="text-right font-mono text-sm font-bold">
          <div
            className={cn(
              "flex items-center justify-end gap-1",
              isProfitable ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {isProfitable ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isProfitable ? "+" : ""}৳
            {holding.realizedProfit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </TableCell>

        {/* Action Buttons */}
        <TableCell className="text-center">
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="destructive"
              className="h-8 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsSellModalOpen(true)}
              disabled={!holding || holding.totalQuantity <= 0}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Sell
            </Button>
          </div>
        </TableCell>
      </ShadcnTableRow>

      <AssetDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        asset={holding}
      />

      <SellAssetModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        asset={holding}
      />
    </>
  );
}

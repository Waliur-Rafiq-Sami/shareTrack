"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

import { IActiveHoldingClient } from "@/app/api/summary/route";
import { AssetDetailsModal } from "../holdings/table/modal/AssetDetailsModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value || 0,
  );

interface ActiveHoldingsCardProps {
  holdings?: IActiveHoldingClient[];
}

export function ActiveHoldingsCard({ holdings = [] }: ActiveHoldingsCardProps) {
  const [selectedAsset, setSelectedAsset] =
    useState<IActiveHoldingClient | null>(null);

  return (
    <>
      <Card className="lg:col-span-2 shadow-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 flex flex-col h-[460px] rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
            <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Active Holdings
            </CardTitle>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="group h-8 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 px-3 rounded-lg transition-all duration-200"
          >
            <Link
              href="/dashboard/holdings"
              className="flex items-center gap-1.5"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </CardHeader>

        {/* Scrollable List */}
        <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {holdings.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No active security investments found.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {holdings.map((holding) => {
                const isProfitable = holding.realizedProfit >= 0;

                return (
                  <div
                    key={holding._id}
                    className="flex justify-between items-center p-4 border rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                  >
                    {/* Left Column: Ticker & Info */}
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 font-mono text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm">
                        {holding.companyName
                          ? holding.companyName.substring(0, 4).toUpperCase()
                          : "AST"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                          {holding.companyName}
                        </h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {holding.totalQuantity.toLocaleString()} Shares
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Amount, Profit & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {formatCurrency(holding.totalInvestedAmount)}
                        </p>
                        <div className="flex justify-end mt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                              isProfitable
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                            }`}
                          >
                            {isProfitable ? (
                              <TrendingUp className="h-3 w-3 stroke-[2.5]" />
                            ) : (
                              <TrendingDown className="h-3 w-3 stroke-[2.5]" />
                            )}
                            {isProfitable ? "+" : ""}
                            {formatCurrency(holding.realizedProfit)}
                          </span>
                        </div>
                      </div>

                      {/* Detail Modal Action Button */}
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedAsset(holding)}
                        className="group px-3 border py-0 my-0 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 hover:border-blue-400/40 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md"
                        title="View Asset Details"
                      >
                        <BarChart3 className="stroke-[2.2] transition-transform duration-300 group-hover:scale-110 scale-125" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AssetDetailsModal
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        asset={selectedAsset}
      />
    </>
  );
}

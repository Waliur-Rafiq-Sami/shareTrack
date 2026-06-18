"use client";

import React, { useState } from "react";
import {
  Loader2,
  AlertCircle,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast-service";

// IMPORT YOUR CUSTOM HOOK HERE
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";

interface SellAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

export function SellAssetModal({
  isOpen,
  onClose,
  asset,
}: SellAssetModalProps) {
  // 1. Initialize the Mutation Hook
  const { mutateAsync: executeTrade, isPending } = useExecuteTransaction();

  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  // Form States
  const [quantity, setQuantity] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">(asset?.avgBuyPrice || 0);
  const [commissionType, setCommissionType] = useState<"PERCENTAGE" | "FIXED">(
    "FIXED",
  );
  const [commissionValue, setCommissionValue] = useState<number | "">(0);

  // Executed State Captures
  const [executedSummary, setExecutedSummary] = useState<{
    qty: number;
    rate: number;
    gross: number;
    comm: number;
    net: number;
  } | null>(null);

  // Calculations
  const qtyNum = Number(quantity) || 0;
  const rateNum = Number(rate) || 0;
  const commValNum = Number(commissionValue) || 0;

  const grossAmount = qtyNum * rateNum;
  const calculatedCommission =
    commissionType === "PERCENTAGE"
      ? grossAmount * (commValNum / 100)
      : commValNum;
  const netCashImpact = grossAmount - calculatedCommission;

  // Real-time Validations
  const isOverQuantity = qtyNum > (asset?.totalQuantity || 0);
  const isInvalid =
    qtyNum <= 0 || rateNum <= 0 || commValNum < 0 || isOverQuantity;

  // Handle Clean Close
  const handleClose = () => {
    setIsSuccessMode(false);
    setQuantity("");
    setCommissionValue(0);
    setHasConfirmed(false);
    setExecutedSummary(null);
    onClose();
  };

  const handleSellSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid || !hasConfirmed) return;

    try {
      // 2. Fire the mutation from your custom hook
      // The hook handles the API call and all query invalidations automatically!
      await executeTrade({
        actionType: "SELL",
        companyName: asset.companyName,
        quantity: qtyNum,
        rate: rateNum,
        commissionType,
        commissionValue: commValNum,
      });

      // 3. Lock dynamic calculations into receipt summary
      setExecutedSummary({
        qty: qtyNum,
        rate: rateNum,
        gross: grossAmount,
        comm: calculatedCommission,
        net: netCashImpact,
      });

      toast.success({
        title: "Order Executed Successfully",
        description: `Sold ${qtyNum} shares of ${asset.companyName}.`,
      });

      // Shift screen view to execution review mode
      setIsSuccessMode(true);
    } catch (err: any) {
      console.error("[SELL_ORDER_ERROR]", err);
      toast.error({
        title: "Order Execution Failed",
        description:
          err.message || "An unexpected error occurred during trade handling.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-slate-950 border-slate-800 text-slate-50 overflow-hidden shadow-2xl transition-all">
        {/* INTERFACE A: ACTIVE TRADE CONFIGURATION & REVIEW */}
        {!isSuccessMode ? (
          <>
            <DialogHeader className="relative">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-100">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 border border-rose-500/20">
                  <DollarSign className="w-5 h-5 animate-pulse" />
                </div>
                Sell {asset?.companyName}
              </DialogTitle>
              <div className="flex items-center justify-between mt-2 bg-slate-900/60 rounded-lg p-2.5 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  Available Portfolio Inventory:
                </span>
                <span className="font-mono font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {asset?.totalQuantity?.toLocaleString() || 0} Units
                </span>
              </div>
            </DialogHeader>

            <form onSubmit={handleSellSubmission} className="space-y-4 mt-2">
              {/* Row 1: Inputs Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Quantity to Liquidate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={asset?.totalQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-mono transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                  {isOverQuantity && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium mt-1 animate-bounce">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Quantity shortfalls detected
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Execution Rate (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={rate}
                    onChange={(e) =>
                      setRate(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-mono transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Brokerage Charges Configurations */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Fee Architecture
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) =>
                      setCommissionType(
                        e.target.value as "PERCENTAGE" | "FIXED",
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-slate-200 font-medium"
                  >
                    <option value="FIXED">Fixed Flat Rate (৳)</option>
                    <option value="PERCENTAGE">
                      Proportional Percentage (%)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Fee Component Value
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={commissionValue}
                    onChange={(e) =>
                      setCommissionValue(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none font-mono transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Live Accounting Summary Cards */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl p-4 border border-slate-800/80 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    Gross Asset Valuation:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    ৳
                    {grossAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    Brokerage Commission Fee:
                  </span>
                  <span className="font-mono text-rose-400 font-medium">
                    - ৳
                    {calculatedCommission.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />{" "}
                    Projected Capital Inflow:
                  </span>
                  <span className="font-mono text-base font-black text-emerald-400">
                    + ৳
                    {netCashImpact.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Safety Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-rose-950/20 rounded-lg border border-rose-900/30 cursor-pointer group hover:bg-rose-950/30 transition-all select-none">
                <input
                  type="checkbox"
                  checked={hasConfirmed}
                  onChange={(e) => setHasConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-800 bg-slate-900 text-rose-600 focus:ring-rose-500 h-4 w-4 accent-rose-600 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                  I authorize this transaction and confirm that selling{" "}
                  <strong className="text-rose-400 font-bold">
                    {qtyNum} units
                  </strong>{" "}
                  at{" "}
                  <strong className="text-slate-100 font-bold">
                    ৳{rateNum}
                  </strong>{" "}
                  matches our current accounting rules.
                </span>
              </label>

              {/* Control Action Buttons */}
              <DialogFooter className="mt-6 border-t border-slate-900 pt-4 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium rounded-lg"
                >
                  Cancel Order
                </Button>
                <Button
                  type="submit"
                  disabled={isInvalid || !hasConfirmed || isPending}
                  className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-5 rounded-lg transition-all shadow-lg shadow-rose-950/20"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Broadcasting Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Execute Sell Transaction</span>
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          /* INTERFACE B: THE PERSISTENT RECEIPT SUMMARY (NEVER HIDDEN UPON SUCCESS) */
          <div className="py-2 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20 mb-1">
                <CheckCircle2 className="w-10 h-10 animate-scaleUp" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                Order Filled Successfully
              </h3>
              <p className="text-xs text-slate-400 max-w-[280px] mx-auto">
                Ledger parameters updated and synced to cache architectures.
              </p>
            </div>

            {/* Permanent Execution Receipt Block */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />{" "}
                  Official Execution Receipt
                </span>
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 text-slate-300 rounded border border-slate-700">
                  ID: FILLED-{Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>

              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Asset Identity:</span>
                  <span className="text-slate-200 font-sans font-bold">
                    {asset?.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume Liquidated:</span>
                  <span className="text-slate-100 font-bold">
                    {executedSummary?.qty.toLocaleString()} Units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate Per Unit:</span>
                  <span className="text-slate-100 font-bold">
                    ৳{executedSummary?.rate.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-slate-800/60 my-1" />
                <div className="flex justify-between text-slate-400">
                  <span>Gross Transacted:</span>
                  <span>
                    ৳
                    {executedSummary?.gross.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fees Accounted:</span>
                  <span className="text-rose-400">
                    - ৳
                    {executedSummary?.comm.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="h-px bg-slate-800 my-1" />
                <div className="flex justify-between items-center text-sm font-bold bg-emerald-950/20 p-2 rounded border border-emerald-900/20">
                  <span className="text-emerald-400 font-sans font-medium">
                    Net Capital Realized:
                  </span>
                  <span className="text-emerald-400 text-base font-black">
                    ৳
                    {executedSummary?.net.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 group transition-all"
              >
                <span>Return to Dashboard Overview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

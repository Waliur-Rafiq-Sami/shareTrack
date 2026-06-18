// // use in dashboard main page
// "use client";

// import React, { useState, useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Loader2,
//   DollarSign,
//   ArrowDownLeft,
//   ArrowUpRight,
//   CheckCircle2,
//   Sparkles,
//   ArrowRight,
//   ShieldCheck,
//   Building,
// } from "lucide-react";
// import { toast } from "@/lib/toast-service";

// interface WalletModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   type: "DEPOSIT" | "WITHDRAW";
//   onSuccess: () => void;
// }

// export function WalletModal({
//   isOpen,
//   onClose,
//   type,
//   onSuccess,
// }: WalletModalProps) {
//   // Initialize the query client to control cache invalidation
//   const queryClient = useQueryClient();

//   const [amount, setAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState<"FORM" | "SUCCESS">("FORM");
//   const [txDetails, setTxDetails] = useState<{
//     id: string;
//     date: string;
//     finalAmount: number;
//   } | null>(null);

//   // Reset state when modal opens/closes
//   useEffect(() => {
//     if (!isOpen) {
//       const timer = setTimeout(() => {
//         setAmount("");
//         setStep("FORM");
//         setTxDetails(null);
//       }, 200);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   const presetAmounts = [100, 500, 1000, 5000];

//   const handlePresetClick = (val: number) => {
//     const current = parseFloat(amount) || 0;
//     setAmount((current + val).toString());
//   };

//   const handleSubmit = async () => {
//     const parsedAmount = parseFloat(amount);
//     if (!amount || parsedAmount <= 0) {
//       toast.error({ title: "Please enter a valid amount greater than 0" });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/wallet/transaction", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ actionType: type, amount: parsedAmount }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.message || "Transaction failed");
//       }

//       setTxDetails({
//         id:
//           data.data?.transactionId ||
//           `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//         date: new Date().toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         finalAmount: parsedAmount,
//       });

//       toast.success({
//         title: data.message || "Transaction registered successfully",
//       });

//       // --- CRITICAL FIX: INVALIDATE REACT QUERY CACHES ---
//       // This forces the dashboard, holdings, and transactions ledger to re-fetch immediately
//       await Promise.all([
//         queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] }),
//         queryClient.invalidateQueries({ queryKey: ["portfolio", "holdings"] }),
//         queryClient.invalidateQueries({ queryKey: ["transactionsLedger"] }),
//       ]);

//       onSuccess();
//       setStep("SUCCESS");
//     } catch (error: any) {
//       toast.error({ title: error.message || "An error occurred" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isDeposit = type === "DEPOSIT";
//   const themeColor = isDeposit ? "emerald" : "rose";

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[440px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090e1a] shadow-2xl rounded-2xl p-0 gap-0">
//         {/* STEP 1: INPUT FORM VIEW */}
//         {step === "FORM" && (
//           <>
//             <div className="p-6 space-y-6">
//               <DialogHeader className="space-y-2">
//                 <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
//                   <div
//                     className={`flex h-10 w-10 items-center justify-center rounded-xl border border-${themeColor}-500/20 bg-${themeColor}-500/10 text-${themeColor}-500 dark:text-${themeColor}-400`}
//                   >
//                     {isDeposit ? (
//                       <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
//                     ) : (
//                       <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
//                     )}
//                   </div>
//                   {isDeposit ? "Deposit Capital" : "Withdraw Funds"}
//                 </DialogTitle>
//                 <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
//                   Enter a specific amount to add or remove funds from your
//                   ledger balance.
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div className="space-y-2.5">
//                   <div className="flex items-center justify-between">
//                     <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                       Amount (USD)
//                     </Label>
//                     {amount && (
//                       <span className="text-xs font-mono text-slate-400">
//                         Ready to commit
//                       </span>
//                     )}
//                   </div>

//                   <div className="relative group">
//                     <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-white transition-colors">
//                       <DollarSign className="h-5 w-5 stroke-[2.5]" />
//                     </div>
//                     <Input
//                       type="number"
//                       placeholder="0.00"
//                       className="pl-11 pr-4 h-14 text-xl font-mono font-bold bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-4 gap-2">
//                   {presetAmounts.map((val) => (
//                     <Button
//                       key={val}
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePresetClick(val)}
//                       className="h-9 rounded-lg font-mono text-xs border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
//                     >
//                       +{val.toLocaleString()}
//                     </Button>
//                   ))}
//                 </div>

//                 <div className="rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 p-3.5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
//                   <div className="flex justify-between">
//                     <span>Gateway Processing Fee</span>
//                     <span className="font-mono text-emerald-500 font-semibold">
//                       0.00% (Free)
//                     </span>
//                   </div>
//                   <div className="flex justify-between border-t border-slate-100 dark:border-slate-900 pt-2 font-medium">
//                     <span>Net Ledger Impact</span>
//                     <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">
//                       {amount
//                         ? `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
//                         : "$0.00"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3 p-4 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-900/60 justify-end">
//               <Button
//                 variant="ghost"
//                 onClick={onClose}
//                 className="h-11 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium px-5 transition-all"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className={`h-11 rounded-xl font-semibold shadow-xl active:scale-95 transition-all px-6 text-white ${
//                   isDeposit
//                     ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20"
//                     : "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20"
//                 }`}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing
//                     Ledger...
//                   </>
//                 ) : (
//                   <span className="flex items-center gap-1.5">
//                     Execute Order{" "}
//                     <ArrowRight className="h-4 w-4 stroke-[2.5]" />
//                   </span>
//                 )}
//               </Button>
//             </div>
//           </>
//         )}

//         {/* STEP 2: PREMIUM SUCCESS SPLASH RECEIPT VIEW */}
//         {step === "SUCCESS" && txDetails && (
//           <div className="relative overflow-hidden">
//             <div
//               className={`absolute -top-24 -left-24 h-48 w-48 rounded-full bg-${themeColor}-500/10 blur-3xl`}
//             />

//             <div className="p-6 text-center space-y-6 relative z-10 pt-10">
//               <div className="flex justify-center">
//                 <div
//                   className={`flex h-16 w-16 items-center justify-center rounded-full bg-${themeColor}-500/10 border border-${themeColor}-500/20 animate-bounce`}
//                 >
//                   <div
//                     className={`flex h-12 w-12 items-center justify-center rounded-full bg-${themeColor}-500/20`}
//                   >
//                     <CheckCircle2
//                       className={`h-7 w-7 text-${themeColor}-500 dark:text-${themeColor}-400 stroke-[2.5]`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
//                   <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />{" "}
//                   Transaction Confirmed
//                 </h3>
//                 <p className="text-sm text-slate-400">
//                   Your account balance has been successfully updated.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 p-4 text-left space-y-3 font-medium text-xs text-slate-500 dark:text-slate-400">
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-400 flex items-center gap-1">
//                     <Building className="h-3.5 w-3.5" /> Registry Core
//                   </span>
//                   <span className="font-mono text-slate-900 dark:text-slate-200">
//                     Ledger API Engine v1
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-400">Transaction ID</span>
//                   <span className="font-mono text-slate-900 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] tracking-wide font-bold">
//                     {txDetails.id}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-400">Settlement Date</span>
//                   <span className="font-mono text-slate-900 dark:text-slate-200">
//                     {txDetails.date}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800/80 pt-3 text-sm">
//                   <span className="text-slate-700 dark:text-slate-300 font-bold">
//                     Total Transferred
//                   </span>
//                   <span
//                     className={`font-mono font-extrabold text-${themeColor}-500 dark:text-${themeColor}-400 text-base`}
//                   >
//                     {isDeposit ? "+" : "-"}$
//                     {txDetails.finalAmount.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
//                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-bit
//                 Secure Cryptographic Settlement
//               </div>

//               <Button
//                 onClick={onClose}
//                 className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all mt-2"
//               >
//                 Acknowledge & Close
//               </Button>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { toast } from "@/lib/toast-service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction"; // Adjust path accordingly

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "DEPOSIT" | "WITHDRAW";
  onSuccess: () => void;
}

export function WalletModal({
  isOpen,
  onClose,
  type,
  onSuccess,
}: WalletModalProps) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"FORM" | "SUCCESS">("FORM");
  const [txDetails, setTxDetails] = useState<{
    id: string;
    date: string;
    finalAmount: number;
  } | null>(null);

  // Initialize unified transaction hook
  const { mutateAsync: executeTransaction, isPending: isLoading } =
    useExecuteTransaction();

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setAmount("");
        setStep("FORM");
        setTxDetails(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const presetAmounts = [100, 500, 1000, 5000];

  const handlePresetClick = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error({ title: "Please enter a valid amount greater than 0" });
      return;
    }

    try {
      // The hook handles API calling and React Query cache invalidation
      const data = await executeTransaction({
        actionType: type,
        amount: parsedAmount,
      });

      setTxDetails({
        id: `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        finalAmount: parsedAmount,
      });

      toast.success({
        title: data.message || "Transaction registered successfully",
      });

      onSuccess();
      setStep("SUCCESS");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error({ title: errorMessage });
    }
  };

  const isDeposit = type === "DEPOSIT";
  const themeColor = isDeposit ? "emerald" : "rose";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090e1a] shadow-2xl rounded-2xl p-0 gap-0">
        {/* STEP 1: INPUT FORM VIEW */}
        {step === "FORM" && (
          <>
            <div className="p-6 space-y-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-${themeColor}-500/20 bg-${themeColor}-500/10 text-${themeColor}-500 dark:text-${themeColor}-400`}
                  >
                    {isDeposit ? (
                      <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                    )}
                  </div>
                  {isDeposit ? "Deposit Capital" : "Withdraw Funds"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  Enter a specific amount to add or remove funds from your
                  ledger balance.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Amount (USD)
                    </Label>
                    {amount && (
                      <span className="text-xs font-mono text-slate-400">
                        Ready to commit
                      </span>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 group-focus-within:text-white transition-colors">
                      <DollarSign className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-11 pr-4 h-14 text-xl font-mono font-bold bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {presetAmounts.map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(val)}
                      className="h-9 rounded-lg font-mono text-xs border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                    >
                      +{val.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 p-3.5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Gateway Processing Fee</span>
                    <span className="font-mono text-emerald-500 font-semibold">
                      0.00% (Free)
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-900 pt-2 font-medium">
                    <span>Net Ledger Impact</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">
                      {amount
                        ? `$${parseFloat(amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}`
                        : "$0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-900/60 justify-end">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium px-5 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`h-11 rounded-xl font-semibold shadow-xl active:scale-95 transition-all px-6 text-white ${
                  isDeposit
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-950/20"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing
                    Ledger...
                  </>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Execute Order{" "}
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </span>
                )}
              </Button>
            </div>
          </>
        )}

        {/* STEP 2: PREMIUM SUCCESS SPLASH RECEIPT VIEW */}
        {step === "SUCCESS" && txDetails && (
          <div className="relative overflow-hidden">
            <div
              className={`absolute -top-24 -left-24 h-48 w-48 rounded-full bg-${themeColor}-500/10 blur-3xl`}
            />

            <div className="p-6 text-center space-y-6 relative z-10 pt-10">
              <div className="flex justify-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-${themeColor}-500/10 border border-${themeColor}-500/20 animate-bounce`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-${themeColor}-500/20`}
                  >
                    <CheckCircle2
                      className={`h-7 w-7 text-${themeColor}-500 dark:text-${themeColor}-400 stroke-[2.5]`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />{" "}
                  Transaction Confirmed
                </h3>
                <p className="text-sm text-slate-400">
                  Your account balance has been successfully updated.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 p-4 text-left space-y-3 font-medium text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" /> Registry Core
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    Ledger API Engine v1
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] tracking-wide font-bold">
                    {txDetails.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Settlement Date</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    {txDetails.date}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800/80 pt-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">
                    Total Transferred
                  </span>
                  <span
                    className={`font-mono font-extrabold text-${themeColor}-500 dark:text-${themeColor}-400 text-base`}
                  >
                    {isDeposit ? "+" : "-"}$
                    {txDetails.finalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-bit
                Secure Cryptographic Settlement
              </div>

              <Button
                onClick={onClose}
                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all mt-2"
              >
                Acknowledge & Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, ArrowUpFromLine, MoveRight } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export type ActionType = "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface IRecentTransaction {
  _id: string;
  actionType: ActionType | string;
  companyName?: string;
  transactionDate: string | Date;
  netCashImpact: number;
  status: TransactionStatus | string;
}

interface RecentTransactionsCardProps {
  transactions: IRecentTransaction[];
}

export function RecentTransactionsCard({
  transactions,
}: RecentTransactionsCardProps) {
  return (
    <Card className="shadow-sm dark:bg-[#0f172a] dark:border-slate-800 flex flex-col h-[450px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
          <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recent Transactions
          </CardTitle>
        </div>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="group h-9 w-9 bg-slate-100/50 dark:bg-slate-900/40 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          title="View All Transactions"
        >
          <Link
            href="/dashboard/transactions"
            className="flex items-center justify-center"
          >
            <MoveRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 stroke-[2.2]" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="p-6 space-y-5">
          {transactions.map((txn: IRecentTransaction) => (
            <div
              key={txn._id}
              className="flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-full flex-shrink-0 ${
                    txn.actionType === "BUY" || txn.actionType === "DEPOSIT"
                      ? "bg-emerald-100 dark:bg-emerald-950/50"
                      : "bg-rose-100 dark:bg-rose-950/50"
                  }`}
                >
                  {txn.actionType === "BUY" || txn.actionType === "DEPOSIT" ? (
                    <ArrowDownToLine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {txn.actionType} {txn.companyName && `- ${txn.companyName}`}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {new Date(txn.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p
                  className={`text-sm font-bold ${
                    txn.netCashImpact > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {txn.netCashImpact > 0 ? "+" : ""}
                  {formatCurrency(txn.netCashImpact)}
                </p>
                <Badge
                  variant={txn.status === "COMPLETED" ? "default" : "secondary"}
                  className={`text-[10px] uppercase font-bold px-2 ${txn.status === "COMPLETED" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  TableHeader as ShadcnTableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ColumnDefinition = {
  label: string;
  align: "text-left" | "text-right" | "text-center";
  tooltip?: string;
  className?: string;
};

export function TableHeader() {
  const columns: ColumnDefinition[] = [
    {
      label: "Last Updated",
      align: "text-left",
      className: "w-[120px]",
    },
    {
      label: "Asset / Company",
      align: "text-left",
      className: "w-[150px]",
    },
    {
      label: "Quantity",
      align: "text-right",
    },
    {
      label: "Avg. Buy Price",
      align: "text-right",
      tooltip:
        "The average cost per share, factoring in total capital deployed.",
    },
    // {
    //   label: "Commission",
    //   align: "text-right",
    //   tooltip: "Broker fees paid to acquire this position.",
    // },
    {
      label: "Total Invested",
      align: "text-right",
      tooltip: "Cost Basis: Total amount spent to acquire shares.",
    },
    {
      label: "Realized Profit",
      align: "text-right",
      tooltip:
        "Net take-home profit calculated after deducting proportionate cost basis.",
    },
    {
      label: "Actions",
      align: "text-center",
      className: "w-[80px]",
    },
  ];

  return (
    <ShadcnTableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
      <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
        {columns.map((col, index) => (
          <TableHead
            key={index}
            className={cn(
              "h-11 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap",
              col.className,
            )}
          >
            <div
              className={cn(
                "flex items-center gap-1.5",
                col.align === "text-right" && "justify-end",
                col.align === "text-center" && "justify-center",
                col.align === "text-left" && "justify-start",
              )}
            >
              <span>{col.label}</span>

              {col.tooltip && (
                <div
                  className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-help shrink-0"
                  title={col.tooltip}
                >
                  <Info className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </ShadcnTableHeader>
  );
}

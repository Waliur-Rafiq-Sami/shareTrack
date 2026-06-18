// "use client";

// import React from "react";
// import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// interface HeaderProps {
//   currentSortBy: string;
//   currentSortOrder: "asc" | "desc";
//   onSort: (key: string) => void;
// }

// export function TransactionTableHeader({
//   currentSortBy,
//   currentSortOrder,
//   onSort,
// }: HeaderProps) {
//   const renderSortIcon = (fieldKey: string) => {
//     if (currentSortBy !== fieldKey)
//       return (
//         <ArrowUpDown className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-100" />
//       );
//     return currentSortOrder === "asc" ? (
//       <ArrowUp className="h-3 w-3 text-indigo-500 font-bold" />
//     ) : (
//       <ArrowDown className="h-3 w-3 text-indigo-500 font-bold" />
//     );
//   };

//   return (
//     <thead>
//       <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider select-none whitespace-nowrap">
//         <th
//           className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("transactionDate")}
//         >
//           <div className="flex items-center gap-1.5">
//             Date & Time {renderSortIcon("transactionDate")}
//           </div>
//         </th>
//         <th
//           className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("actionType")}
//         >
//           <div className="flex items-center gap-1.5">
//             Type {renderSortIcon("actionType")}
//           </div>
//         </th>
//         <th
//           className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("companyName")}
//         >
//           <div className="flex items-center gap-1.5">
//             Asset {renderSortIcon("companyName")}
//           </div>
//         </th>
//         <th className="p-4 text-right">Qty / Rate</th>
//         <th
//           className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("grossAmount")}
//         >
//           <div className="flex items-center gap-1.5 justify-end">
//             Gross {renderSortIcon("grossAmount")}
//           </div>
//         </th>
//         <th
//           className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("commissionAmount")}
//         >
//           <div className="flex items-center gap-1.5 justify-end">
//             Commission {renderSortIcon("commissionAmount")}
//           </div>
//         </th>
//         <th
//           className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
//           onClick={() => onSort("netCashImpact")}
//         >
//           <div className="flex items-center gap-1.5 justify-end">
//             Net Impact {renderSortIcon("netCashImpact")}
//           </div>
//         </th>
//         <th className="p-4 text-center">Status</th>
//         <th className="p-4 text-right">Actions</th>{" "}
//         {/* Action Header Tab Column */}
//       </tr>
//     </thead>
//   );
// }

"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface HeaderProps {
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onSort: (key: string) => void;
}

export function TransactionTableHeader({
  currentSortBy,
  currentSortOrder,
  onSort,
}: HeaderProps) {
  const renderSortIcon = (fieldKey: string) => {
    if (currentSortBy !== fieldKey)
      return (
        <ArrowUpDown className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-100" />
      );
    return currentSortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-indigo-500 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-500 font-bold" />
    );
  };

  return (
    <thead>
      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider select-none whitespace-nowrap">
        <th
          className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("transactionDate")}
        >
          <div className="flex items-center gap-1.5">
            Date & Time {renderSortIcon("transactionDate")}
          </div>
        </th>
        <th
          className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("actionType")}
        >
          <div className="flex items-center gap-1.5">
            Type {renderSortIcon("actionType")}
          </div>
        </th>
        <th
          className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("companyName")}
        >
          <div className="flex items-center gap-1.5">
            Asset {renderSortIcon("companyName")}
          </div>
        </th>
        <th className="p-4 text-right">Qty / Rate</th>
        <th
          className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("grossAmount")}
        >
          <div className="flex items-center gap-1.5 justify-end">
            Gross {renderSortIcon("grossAmount")}
          </div>
        </th>
        <th
          className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("commissionAmount")}
        >
          <div className="flex items-center gap-1.5 justify-end">
            Commission {renderSortIcon("commissionAmount")}
          </div>
        </th>
        <th
          className="p-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
          onClick={() => onSort("netCashImpact")}
        >
          <div className="flex items-center gap-1.5 justify-end">
            Net Impact {renderSortIcon("netCashImpact")}
          </div>
        </th>
        <th className="p-4 text-center">Status</th>
        <th className="p-4 text-right">Actions</th>
        {/* Action Header Tab Column */}
      </tr>
    </thead>
  );
}

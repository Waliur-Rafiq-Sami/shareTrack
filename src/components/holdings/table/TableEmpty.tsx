"use client";

import React from "react";
import { Inbox } from "lucide-react";

export function TableEmpty() {
  return (
    <tr>
      <td colSpan={7} className="p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
          <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            No Asset Allocation Data Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            There are no holdings matched your active portfolio execution
            filters or current search terms.
          </p>
        </div>
      </td>
    </tr>
  );
}

// "use client";

// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
// import { toast } from "@/lib/toast-service"; // Adjust based on your setup

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import TradeTableSkeleton from "../skeletons/TradeTableSkeleton";
// import { TradeActions } from "./TradeActions";

// interface TradeTableProps {
//   data: any[];
//   isLoading: boolean;
//   onEdit: (trade: any) => void; // Passed from parent to open edit modal
// }

// export default function TradeTable({ data, isLoading, onEdit }: TradeTableProps) {
//   const queryClient = useQueryClient();
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);

//   // Individual Delete Mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Deletion failed");
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success({ title: "Record Deleted" });
//       queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
//     },
//     onError: () => toast.error({ title: "Failed to delete record" }),
//   });

//   // Bulk Delete Mutation
//   const bulkDeleteMutation = useMutation({
//     mutationFn: async (ids: string[]) => {
//       // For enterprise scale, you should create a true bulk API endpoint (e.g., POST /api/trades/bulk-delete)
//       // For now, this fires concurrent individual DELETE requests natively.
//       const promises = ids.map((id) => fetch(`/api/trades/${id}`, { method: "DELETE" }));
//       await Promise.all(promises);
//     },
//     onSuccess: () => {
//       toast.success({ title: "Multiple Records Deleted" });
//       setSelectedIds([]); // Clear selection after deletion
//       queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
//     },
//   });

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedIds(data.map((trade) => trade._id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedIds((prev) => [...prev, id]);
//     } else {
//       setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
//     }
//   };

//   const handleBulkDelete = () => {
//     if (confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
//       bulkDeleteMutation.mutate(selectedIds);
//     }
//   };
//   if (isLoading) return <TradeTableSkeleton />;
//   return (
//     <div className="w-full">
//       {/* Bulk Actions Header */}
//       {selectedIds.length > 0 && (
//         <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-3 flex items-center justify-between">
//           <span className="text-sm font-medium text-rose-600">{selectedIds.length} record(s) selected</span>
//           <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending} className="h-8 shadow-sm">
//             <Trash2 className="h-4 w-4 mr-2" />
//             {bulkDeleteMutation.isPending ? "Erasing..." : "Delete Selected"}
//           </Button>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader className="bg-muted/50 border-b">
//             <TableRow>
//               <TableHead className="w-[40px] text-center">
//                 <Checkbox
//                   checked={data?.length > 0 && selectedIds.length === data.length}
//                   onCheckedChange={handleSelectAll}
//                   aria-label="Select all"
//                 />
//               </TableHead>
//               <TableHead className="font-semibold">Execution Date</TableHead>
//               <TableHead className="font-semibold">Instrument</TableHead>
//               <TableHead className="font-semibold text-center">Action</TableHead>
//               <TableHead className="text-right font-semibold">Quantity</TableHead>
//               <TableHead className="text-right font-semibold">Rate</TableHead>
//               <TableHead className="text-right font-semibold">Commission</TableHead>
//               <TableHead className="text-right font-semibold">Net Impact</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TradeTableSkeleton />
//             ) : data?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
//                   No matching ledger records compiled.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data?.map((trade: any) => (
//                 <TableRow
//                   key={trade._id}
//                   className={`hover:bg-muted/30 transition-colors border-b ${selectedIds.includes(trade._id) ? "bg-muted/50" : ""}`}>
//                   <TableCell>
//                     <Checkbox checked={selectedIds.includes(trade._id)} onCheckedChange={(c) => handleSelectOne(trade._id, !!c)} />
//                   </TableCell>
//                   <TableCell className="font-medium text-muted-foreground">
//                     {new Date(trade.transactionDate).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </TableCell>
//                   <TableCell className="font-bold tracking-wide uppercase">{trade.instrument}</TableCell>
//                   <TableCell className="text-center">
//                     <span
//                       className={`px-2 py-0.5 rounded text-xs font-bold inline-block ${
//                         trade.tradeType === "BUY"
//                           ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
//                           : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
//                       }`}>
//                       {trade.tradeType}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right font-medium">{trade.quantity.toLocaleString()}</TableCell>
//                   <TableCell className="text-right font-medium">{trade.rate.toFixed(2)}</TableCell>
//                   <TableCell className="text-right text-muted-foreground">{trade.commission.toFixed(2)}</TableCell>
//                   <TableCell className={`text-right font-semibold ${trade.netAmount < 0 ? "text-rose-500" : "text-emerald-500"}`}>
//                     {trade.netAmount < 0 ? "" : "+"}
//                     {trade.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <TradeActions trade={trade} onEdit={onEdit} onDelete={(id) => deleteMutation.mutate(id)} />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Edit2, Trash2, MoreHorizontal, ListChecks, FileDown, X } from "lucide-react";
// import { toast } from "@/lib/toast-service";

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import TradeTableSkeleton from "../skeletons/TradeTableSkeleton";
// import { TradeActions } from "./TradeActions";

// interface TradeTableProps {
//   data: any[];
//   isLoading: boolean;
//   onEdit: (trade: any) => void;
// }

// export default function TradeTable({ data, isLoading, onEdit }: TradeTableProps) {
//   const queryClient = useQueryClient();
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [isSelectionMode, setIsSelectionMode] = useState(false);
//   const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

//   // Mutations
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Deletion failed");
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success({ title: "Record Deleted" });
//       queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
//     },
//   });

//   const bulkDeleteMutation = useMutation({
//     mutationFn: async (ids: string[]) => {
//       const res = await fetch("/api/trades/bulk-delete", {
//         method: "POST",
//         body: JSON.stringify({ ids }),
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!res.ok) throw new Error("Bulk deletion failed");
//     },
//     onSuccess: () => {
//       toast.success({ title: "Records Deleted" });
//       setSelectedIds([]);
//       setIsSelectionMode(false);
//       setShowBulkDeleteDialog(false);
//       queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
//     },
//   });

//   // Handlers
//   const handleSelectAll = (checked: boolean) => {
//     setSelectedIds(checked ? data.map((t) => t._id) : []);
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
//   };

//   if (isLoading) return <TradeTableSkeleton />;

//   return (
//     <div className="w-full relative">
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader className="bg-muted/50 border-b">
//             <TableRow>
//               {isSelectionMode && (
//                 <TableHead className="w-[40px] text-center">
//                   <Checkbox checked={data?.length > 0 && selectedIds.length === data.length} onCheckedChange={handleSelectAll} />
//                 </TableHead>
//               )}
//               <TableHead className="font-semibold">Execution Date</TableHead>
//               <TableHead className="font-semibold">Instrument</TableHead>
//               <TableHead className="font-semibold text-center">Action</TableHead>
//               <TableHead className="text-right font-semibold">Quantity</TableHead>
//               <TableHead className="text-right font-semibold">Rate</TableHead>
//               <TableHead className="text-right font-semibold">Commission</TableHead>
//               <TableHead className="text-right font-semibold">Net Impact</TableHead>

//               {/* Bulk Actions Header Menu */}
//               <TableHead className="w-[50px] text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                     <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/20" />
//                     <DropdownMenuItem onClick={() => setIsSelectionMode(!isSelectionMode)} className="cursor-pointer">
//                       <ListChecks className="mr-2 h-4 w-4" />
//                       {isSelectionMode ? "Exit Select Mode" : "Select Multiple"}
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="cursor-pointer">
//                       <FileDown className="mr-2 h-4 w-4" /> Export PDF
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data?.map((trade: any) => (
//               <TableRow key={trade._id} className={selectedIds.includes(trade._id) ? "bg-muted/50" : ""}>
//                 {isSelectionMode && (
//                   <TableCell>
//                     <Checkbox checked={selectedIds.includes(trade._id)} onCheckedChange={(c) => handleSelectOne(trade._id, !!c)} />
//                   </TableCell>
//                 )}
//                 <TableCell className="font-medium text-muted-foreground">{new Date(trade.transactionDate).toLocaleDateString()}</TableCell>
//                 <TableCell className="font-bold">{trade.instrument}</TableCell>
//                 <TableCell className="text-center">
//                   <span
//                     className={`px-2 py-0.5 rounded text-xs font-bold ${trade.tradeType === "BUY" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
//                     {trade.tradeType}
//                   </span>
//                 </TableCell>
//                 <TableCell className="text-right">{trade.quantity.toLocaleString()}</TableCell>
//                 <TableCell className="text-right">{trade.rate.toFixed(2)}</TableCell>
//                 <TableCell className="text-right">{trade.commission.toFixed(2)}</TableCell>
//                 <TableCell className="text-right font-semibold">{trade.netAmount.toLocaleString()}</TableCell>
//                 <TableCell className="text-right">
//                   <TradeActions trade={trade} onEdit={onEdit} onDelete={(id) => deleteMutation.mutate(id)} />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Bulk Action Bar - Bottom Left */}
//       {isSelectionMode && selectedIds.length > 0 && (
//         <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4 bg-background border shadow-lg rounded-lg p-3 animate-in fade-in slide-in-from-bottom-4">
//           <span className="text-sm font-medium text-muted-foreground">{selectedIds.length} record(s) selected</span>
//           <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteDialog(true)} className="bg-red-600 hover:bg-red-700">
//             <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setIsSelectionMode(false);
//               setSelectedIds([]);
//             }}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       )}

//       {/* Confirmation Dialog */}
//       <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete {selectedIds.length} selected records. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={() => bulkDeleteMutation.mutate(selectedIds)} className="bg-red-600 hover:bg-red-700">
//               Confirm Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast-service";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ListChecks, FileDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import TradeTableSkeleton from "../skeletons/TradeTableSkeleton";
import { TradeTableRow } from "./TradeTableRow";
import { BulkActionBar } from "./BulkActionBar";

export default function TradeTable({ data, isLoading, onEdit }: any) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await fetch(`/api/trades/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      // toast.success({ title: "Record Deleted" });
      queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/trades/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast.success({ title: "Records Deleted" });
      setSelectedIds([]);
      setIsSelectionMode(false);
      setShowBulkDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["trade-registry"] });
    },
  });

  const handleSelectAll = (checked: boolean) => setSelectedIds(checked ? data.map((t: any) => t._id) : []);
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };
  if (isLoading) {
    return <TradeTableSkeleton />;
  }

  return (
    <div className="w-full rounded-xl border border-border/50 shadow-sm bg-background overflow-hidden">
      <div className="overflow-x-auto relative">
        <Table>
          {/* STICKY HEADER - Enterprise Standard */}
          <TableHeader className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/80 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)] transition-all">
            <TableRow className="hover:bg-transparent bg-muted/20 border-none h-12">
              {isSelectionMode && (
                <TableHead className="w-[40px] text-center align-middle">
                  <Checkbox
                    className="rounded border border-red-500/60 data-[state=checked]:bg-red-500 data-[state=checked]:text-primary-foreground"
                    checked={data?.length > 0 && selectedIds.length === data.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {[
                { label: "Execution Date", align: "left" },
                { label: "Instrument", align: "left" },
                { label: "Action", align: "center" },
                { label: "Quantity", align: "right" },
                { label: "Rate", align: "right" },
                { label: "Commission", align: "right" },
                { label: "Net Impact", align: "right" },
              ].map((col) => (
                <TableHead
                  key={col.label}
                  className={`h-12 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 align-middle ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  }`}>
                  {col.label}
                </TableHead>
              ))}

              <TableHead className="w-[50px] text-right align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm border border-transparent hover:border-border/50 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 bg-background border shadow-md">
                    <DropdownMenuLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      View Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/20" />
                    <DropdownMenuItem onClick={() => setIsSelectionMode(!isSelectionMode)} className="cursor-pointer font-medium">
                      <ListChecks className="mr-2 h-4 w-4 text-primary" />
                      {isSelectionMode ? "Exit Select Mode" : "Select Multiple"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-medium">
                      <FileDown className="mr-2 h-4 w-4 text-primary" /> Export Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                  No trade records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((trade: any) => (
                <TradeTableRow
                  key={trade._id}
                  trade={trade}
                  isSelected={selectedIds.includes(trade._id)}
                  isSelectionMode={isSelectionMode}
                  onToggleSelect={handleSelectOne}
                  onEdit={onEdit}
                  onDelete={(id: string) => deleteMutation.mutate(id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Floating Action Bar */}
      {isSelectionMode && selectedIds.length > 0 && (
        <BulkActionBar
          count={selectedIds.length}
          onDelete={() => setShowBulkDeleteDialog(true)}
          onCancel={() => {
            setIsSelectionMode(false);
            setSelectedIds([]);
          }}
        />
      )}

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove <strong>{selectedIds.length}</strong> records? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={bulkDeleteMutation.isPending}>
              {bulkDeleteMutation.isPending ? "Processing..." : "Delete Records"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface ListProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function CalculationList({ items, onEdit, onDelete }: ListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        No calculations saved yet.
      </div>
    );
  }

  return (
    <div>
      {/* MOBILE CARDS VIEW */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 bg-card shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-base tracking-wide">
                {item.instrument}
              </span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEdit(item)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs text-muted-foreground">
              <div>
                Shares:{" "}
                <span className="text-foreground font-medium">
                  {item.quantity}
                </span>
              </div>
              <div>
                Avg Buy:{" "}
                <span className="text-foreground font-medium">
                  ৳{item.buyPrice}
                </span>
              </div>
              <div>
                Total Cost:{" "}
                <span className="text-foreground font-medium">
                  ৳{item.totalCost}
                </span>
              </div>
              <div>
                Current Value:{" "}
                <span className="text-foreground font-medium">
                  ৳{item.totalValue}
                </span>
              </div>
            </div>
            <div
              className={`pt-2 border-t flex justify-between items-center text-sm font-bold ${item.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              <span className="flex items-center gap-1">
                {item.profit >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}{" "}
                Profit/Loss:
              </span>
              <span>৳{item.profit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP DATA TABLE VIEW */}
      <div className="hidden md:block border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Stock Name</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Buy Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
              <TableHead className="text-right">Profit / Loss</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-semibold">
                  {item.instrument}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">৳{item.buyPrice}</TableCell>
                <TableCell className="text-right">৳{item.sellPrice}</TableCell>
                <TableCell className="text-right">৳{item.totalCost}</TableCell>
                <TableCell className="text-right">৳{item.totalValue}</TableCell>
                <TableCell
                  className={`text-right font-bold ${item.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  ৳{item.profit}
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => onDelete(item._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

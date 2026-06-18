import { z } from "zod";

export const tradeInputSchema = z.object({
  instrument: z.string().min(1, "Instrument ticker name is required").trim(),

  tradeType: z
    .enum(["BUY", "SELL"], {
      errorMap: () => ({ message: "Trade type must be either BUY or SELL" }),
    })
    .default("BUY"),

  quantity: z.coerce.number().positive("Quantity must be at least 1 share"),

  rate: z.coerce.number().nonnegative("Rate or share price cannot be negative"),

  commission: z.coerce
    .number()
    .nonnegative("Brokerage commission cannot be negative")
    .default(0),

  transactionDate: z.string().datetime().or(z.string().date()).optional(),
});

export type TradeInputType = z.infer<typeof tradeInputSchema>;

import { z } from "zod";

export const ShareCalcZodSchema = z.object({
  instrument: z
    .string()
    .min(1, "Stock/Share name is required")
    .toUpperCase()
    .trim(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  buyPrice: z.number().positive("Buying price must be greater than 0"),
  sellPrice: z
    .number()
    .positive("Selling/Current price must be greater than 0"),
});

export type TShareCalcInput = z.infer<typeof ShareCalcZodSchema>;

import { z } from "zod";

export const addJournalEntrySchema = z.object({
  initialInvestment: z.number().min(1),
  peakMargin: z.number().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  asset: z.string(),
  position: z.enum(["Long", "Short"]),
  leverage: z.number().min(1),
  margin: z.number().min(1),
  entry: z.number().min(1),
  exit: z.number().min(1),
  stop: z.number().min(1),
  notes: z.string().optional(),
});

export const updateJournalEntrySchema = addJournalEntrySchema.partial().extend({
  id: z.string().min(1),
});

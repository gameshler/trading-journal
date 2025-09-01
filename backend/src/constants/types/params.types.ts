import mongoose from "mongoose";

export type CreateAccountParams = {
  fullName: string;
  email: string;
  password: string;
  userAgent?: string;
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export type AddJournalEntryParams = {
  userId: mongoose.Types.ObjectId;
  initialInvestment: number;
  peakMargin: number;
  startDate: Date;
  endDate?: Date;
  asset: string;
  position: "Long" | "Short";
  leverage: number;
  margin: number;
  entry: number;
  exit: number;
  stop: number;
  notes?: string;
};

export type UpdateJournalEntryParams = {
  userId: mongoose.Types.ObjectId;
  id: string;
  update: Partial<AddJournalEntryParams> & { id: string };
};

export type JournalSummaryParams = {
  totalPnl: number;
  pnlPercentOfPeakMargin: number;
  pnlPercentFromStart: number;
  totalEquity: number;
  peakEquity: number;
  winRatePercent: number;
  averageRRR: number;
  profitFactor: number;
  averagePnl: number;
  maxDrawdown: number;
  returnOnMaxDrawdown: number;
};
export type JournalEntry = {
  pnl: number;
  rrRatio: number;
  peakEquity: number;
  drawdownPercent: number;
  initialInvestment: number;
  peakMargin: number;
};

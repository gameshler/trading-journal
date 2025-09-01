import mongoose from "mongoose";
import verificationCodeType from "../enums/verificationCodeTypes";

export interface sessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface UserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  verified: boolean;

  role: "user" | "admin";

  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    | "_id"
    | "email"
    | "verified"
    | "fullName"
    | "role"
    | "createdAt"
    | "updatedAt"
  >;
}

export interface verificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: verificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

export interface JournalDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  initialInvestment: number;
  peakMargin: number;
  tradeId: number;
  startDate: Date;
  endDate?: Date;
  asset: string;
  position: "Long" | "Short";
  leverage: number;
  margin: number;
  positionSize: number;
  entry: number;
  exit: number;
  stop: number;
  amount: number;
  value: number;
  stopLoss: number;
  pnl: number;
  pnlPercent: number;
  rrRatio: number;
  equity: number;
  peakEquity: number;
  drawdownPercent: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

import mongoose from "mongoose";
import { JournalDocument } from "../../constants/interfaces/model.interface";

const journalSchema = new mongoose.Schema<JournalDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    initialInvestment: { type: Number, required: true },
    peakMargin: { type: Number, required: true },
    tradeId: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    asset: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["Long", "Short"],
      required: true,
    },
    leverage: {
      type: Number,
      required: true,
    },
    margin: {
      type: Number,
      required: true,
    },
    positionSize: {
      type: Number,
      required: true,
    },
    entry: {
      type: Number,
      required: true,
    },
    exit: {
      type: Number,
      required: true,
    },
    stop: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    stopLoss: {
      type: Number,
      required: true,
    },
    pnl: {
      type: Number,
      required: true,
    },
    pnlPercent: {
      type: Number,
      required: true,
    },
    rrRatio: {
      type: Number,
      required: true,
    },
    equity: {
      type: Number,
      required: true,
    },
    peakEquity: {
      type: Number,
      required: true,
    },
    drawdownPercent: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const JournalModel = mongoose.model<JournalDocument>("Journal", journalSchema);
export default JournalModel;

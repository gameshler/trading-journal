import mongoose from "mongoose";
import JournalModel from "../models/journal";
import { getTradeMetrics } from "./formulas";

export const recalculateFromTrade = async (
  userId: mongoose.Types.ObjectId,
  startTradeId: number,
  startEquity: number
) => {
  const trades = await JournalModel.find({
    userId,
    tradeId: { $gte: startTradeId },
  }).sort({ tradeId: 1 });

  let equity = startEquity;

  for (const t of trades) {
    const metrics = getTradeMetrics(t.toObject(), {
      tradeId: t.tradeId - 1,
      equity,
    });

    await JournalModel.updateOne({ _id: t._id, userId }, { $set: metrics });
    equity = metrics.equity;
  }
};

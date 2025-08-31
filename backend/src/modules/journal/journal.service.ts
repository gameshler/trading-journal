import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http";
import {
  AddJournalEntryParams,
  JournalSummaryParams,
  UpdateJournalEntryParams,
} from "../../constants/types/params.types";
import JournalModel from "../../shared/models/journal";
import appAssert from "../../shared/utils/appAssert";
import {
  getJournalSummaryMetrics,
  getTradeMetrics,
} from "../../shared/utils/formulas";
import xlsx from "xlsx";
import { recalculateFromTrade } from "../../shared/utils/recalculateFormulas";
export const addJournalEntry = async (params: AddJournalEntryParams) => {
  const prev = await JournalModel.findOne({
    userId: params.userId,
  }).sort({
    tradeId: -1,
  });
  const metrics = getTradeMetrics(
    params,
    prev ? { tradeId: prev.tradeId, equity: prev.equity } : null
  );

  const newJournalEntry = await JournalModel.create({
    ...metrics,
  });
  const savedJournalEntry = await newJournalEntry.save();
  appAssert(
    savedJournalEntry,
    INTERNAL_SERVER_ERROR,
    "Failed to save journal entry"
  );
  return savedJournalEntry;
};

export const getAllUserJournalEntries = async (userId: string) => {
  const journalEntries = await JournalModel.find({ userId }).sort({
    startDate: -1,
  });
  return journalEntries;
};

export const deleteJournalEntry = async (journalId: string) => {
  const deleted = await JournalModel.findById(journalId).lean();
  appAssert(deleted, NOT_FOUND, "Journal entry not found");

  const { userId, tradeId } = deleted;

  await JournalModel.deleteOne({ _id: journalId });

  await JournalModel.updateMany(
    { userId, tradeId: { $gt: tradeId } },
    { $inc: { tradeId: -1 } }
  );
  const prev = await JournalModel.findOne({
    userId,
    tradeId: tradeId - 1,
  }).lean();
  const startTradeId = prev ? prev.tradeId + 1 : 1;
  const startEquity = prev ? prev.equity : 0;
  await recalculateFromTrade(userId, startTradeId, startEquity);

  return deleted;
};

export const getJournalEntriesForExcel = async (userId: string) => {
  const journal = await JournalModel.find({ userId }).sort({
    startDate: -1,
  });
  const data = journal.map(
    ({
      tradeId,
      startDate,
      endDate,
      asset,
      position,
      leverage,
      margin,
      positionSize,
      entry,
      exit,
      stop,
      amount,
      value,
      stopLoss,
      pnl,
      pnlPercent,
      rrRatio,
      equity,
      peakEquity,
      drawdownPercent,
      notes,
    }) => ({
      TradeId: tradeId,
      StartDate: startDate.toISOString().split("T")[0],
      EndDate: endDate?.toISOString().split("T")[0],
      Asset: asset,
      Position: position,
      Leverage: leverage,
      Margin: margin,
      PositionSize: positionSize,
      Entry: entry,
      Exit: exit,
      Stop: stop,
      Amount: amount,
      Value: value,
      StopLoss: stopLoss,
      Pnl: pnl,
      PnlPercent: pnlPercent,
      RRRatio: rrRatio,
      Equity: equity,
      PeakEquity: peakEquity,
      DrawdownPercent: drawdownPercent,
      Notes: notes,
    })
  );
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "Trading Journal");
  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
};

export const updateJournalEntry = async ({
  userId,
  id,
  update,
}: UpdateJournalEntryParams) => {
  const current = await JournalModel.findOne({ _id: id, userId });
  appAssert(current, NOT_FOUND, "Journal entry not found");

  const prev = await JournalModel.findOne({
    userId,
    tradeId: { $lt: current.tradeId },
  })
    .sort({ tradeId: -1 })
    .lean();

  const merged = { ...current.toObject(), ...update, userId };

  const updatedMetrics = getTradeMetrics(
    merged,
    prev
      ? {
          tradeId: prev.tradeId,
          equity: prev.equity,
        }
      : null
  );

  await JournalModel.updateOne({ _id: id, userId }, { $set: updatedMetrics });

  await recalculateFromTrade(
    userId,
    updatedMetrics.tradeId + 1,
    updatedMetrics.equity
  );
};

export const getJournalSummary = async (userId: string) => {
  const entries = await JournalModel.find({ userId })
    .sort({ tradeId: 1 })
    .lean();

  appAssert(entries.length > 0, NOT_FOUND, "No journal entries found");

  return getJournalSummaryMetrics(entries);
};

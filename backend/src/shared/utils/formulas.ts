import {
  AddJournalEntryParams,
  JournalEntry,
  JournalSummaryParams,
} from "../../constants/types/params.types";
export const getTradeMetrics = (
  {
    userId,
    initialInvestment,
    peakMargin,
    startDate,
    endDate,
    asset,
    position,
    leverage,
    margin,
    entry,
    exit,
    stop,
    notes,
  }: AddJournalEntryParams,
  prev: { tradeId: number; equity: number } | null
) => {
  const tradeId = (prev?.tradeId ?? 0) + 1;
  const positionSize = margin * leverage;
  const amount = positionSize / entry;
  const value = amount * exit;
  const stopLoss =
    position === "Long"
      ? stop * amount - positionSize
      : -Math.abs(stop * amount - positionSize);
  const pnl =
    position === "Long"
      ? exit * amount - positionSize
      : entry * amount - exit * amount;
  const pnlPercent = (pnl / margin) * 100;
  const rrRatio =
    pnl < 0 ? -Math.abs(pnl / stopLoss) : Math.abs(pnl / stopLoss);
  const previousEquity = prev?.equity ?? initialInvestment;
  const equity = previousEquity + pnl;
  const peakEquity = Math.max(previousEquity, equity);
  const drawdownPercent = ((equity - peakEquity) / peakEquity) * 100;
  return {
    userId,
    tradeId,
    initialInvestment,
    peakMargin,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : undefined,
    asset,
    position,
    leverage,
    margin,
    entry,
    exit,
    stop,
    positionSize,
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
  };
};

export const getJournalSummaryMetrics = (
  entries: JournalEntry[]
): JournalSummaryParams => {
  const first = entries[0];

  let totalPnl = 0;
  let totalRRR = 0;
  let totalLoss = 0;
  let winCount = 0;
  let peakEquity = entries[0].peakEquity;
  let minDrawdown = entries[0].drawdownPercent;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    totalPnl += e.pnl;
    totalRRR += e.rrRatio;
    if (e.pnl > 0) winCount++;
    else totalLoss += e.pnl;

    if (e.peakEquity > peakEquity) peakEquity = e.peakEquity;
    if (e.drawdownPercent < minDrawdown) minDrawdown = e.drawdownPercent;
  }

  const pnlPercentOfPeakMargin =
    first.peakMargin === 0 ? 0 : (totalPnl / first.peakMargin) * 100;

  const pnlPercentFromStart =
    first.initialInvestment === 0
      ? 0
      : (totalPnl / first.initialInvestment) * 100;

  const totalEquity = totalPnl + first.initialInvestment;

  const winRatePercent = (winCount / entries.length) * 100;

  const averageRRR = totalRRR / entries.length;

  const profitFactor = totalLoss === 0 ? totalPnl : totalPnl / -totalLoss;

  const averagePnl = entries.length === 0 ? 0 : totalPnl / entries.length;

  const returnOnMaxDrawdown =
    minDrawdown === 0 ? 0 : pnlPercentFromStart / -minDrawdown;

  return {
    totalPnl,
    pnlPercentOfPeakMargin,
    pnlPercentFromStart,
    totalEquity,
    peakEquity,
    winRatePercent,
    averageRRR,
    profitFactor,
    averagePnl,
    maxDrawdown: minDrawdown,
    returnOnMaxDrawdown,
  };
};

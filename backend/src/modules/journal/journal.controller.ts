import { z } from "zod";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../../constants/http";
import appAssert from "../../shared/utils/appAssert";
import catchErrors from "../../shared/utils/catchErrors";
import {
  addJournalEntrySchema,
  updateJournalEntrySchema,
} from "./journal.schemas";
import {
  addJournalEntry,
  deleteJournalEntry,
  getAllUserJournalEntries,
  getJournalEntriesForExcel,
  getJournalSummary,
  updateJournalEntry,
} from "./journal.service";

export const addJournalEntryHandler = catchErrors(async (req, res) => {
  const journalData = addJournalEntrySchema.parse({
    ...req.body,
  });
  const userId = req.userId;
  const savedJournalEntry = await addJournalEntry({
    userId,
    ...journalData,
  });
  return res.status(OK).json({
    message: "Journal entry added successfully",
    data: savedJournalEntry,
  });
});

export const getAllUserJournalEntriesHandler = catchErrors(async (req, res) => {
  const userId = String(req.userId);
  const journalEntries = await getAllUserJournalEntries(userId);
  appAssert(
    journalEntries,
    INTERNAL_SERVER_ERROR,
    "Failed to get journal entries"
  );
  return res.status(OK).json({
    message: "Journal entries retrieved successfully",
    data: journalEntries,
  });
});

export const deleteJournalEntryHandler = catchErrors(async (req, res) => {
  const journalId = z.string().parse(req.params.id);
  await deleteJournalEntry(journalId);
  return res.status(OK).json({ message: "Journal entry deleted successfully" });
});

export const downloadJournalExcelHandler = catchErrors(async (req, res) => {
  const userId = String(req.userId);
  const excelBuffer = await getJournalEntriesForExcel(userId);
  appAssert(
    excelBuffer && excelBuffer.length > 0,
    INTERNAL_SERVER_ERROR,
    "Failed to generate Excel file"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="trading_journal.xlsx"'
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.status(OK).send(excelBuffer);
});

export const updateJournalEntryHandler = catchErrors(async (req, res) => {
  const { id } = updateJournalEntrySchema.parse(req.params);

  const updateData = updateJournalEntrySchema.parse({
    ...req.body,
    id,
  });

  const userId = req.userId;

  const updatedJournalEntry = await updateJournalEntry({
    userId,
    id: updateData.id,
    update: updateData,
  });

  return res.status(OK).json({
    message: "Journal entry updated successfully",
    data: updatedJournalEntry,
  });
});

export const getJournalSummaryHandler = catchErrors(async (req, res) => {
  const userId = String(req.userId);
  const summary = await getJournalSummary(userId);
  appAssert(summary, NOT_FOUND, "Journal summary not found");
  return res.status(OK).json({
    message: "Journal summary retrieved successfully",
    data: summary,
  });
});

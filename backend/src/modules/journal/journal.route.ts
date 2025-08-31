import { Router } from "express";
import {
  addJournalEntryHandler,
  deleteJournalEntryHandler,
  downloadJournalExcelHandler,
  getAllUserJournalEntriesHandler,
  getJournalSummaryHandler,
  updateJournalEntryHandler,
} from "./journal.controller";
import limiter from "../../shared/middleware/rateLimiter";
const journalRoutes = Router();

journalRoutes.post("/entry", limiter, addJournalEntryHandler);
journalRoutes.get("/", getAllUserJournalEntriesHandler);
journalRoutes.get("/summary", getJournalSummaryHandler);
journalRoutes.delete("/:id", limiter, deleteJournalEntryHandler);
journalRoutes.get("/download", downloadJournalExcelHandler);
journalRoutes.patch("/:id", limiter, updateJournalEntryHandler);
export default journalRoutes;

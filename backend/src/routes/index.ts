import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import authenticate from "../shared/middleware/authenticate";
import userRoutes from "../modules/user/user.route";
import sessionRoutes from "../modules/auth/session/session.route";
import journalRoutes from "../modules/journal/journal.route";

const routes = Router();

// user routes
routes.use("/auth", authRoutes);
routes.use("/user", authenticate, userRoutes);
routes.use("/sessions", authenticate, sessionRoutes);
routes.use("/journal", authenticate, journalRoutes);

export default routes;

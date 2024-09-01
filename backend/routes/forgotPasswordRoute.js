import express from "express";
import { changePassword, checkEmail, fetchEmailTemplateBySlug } from "../controllers/forgotPassword.js";


const router = express.Router();
router.post("/check-email", checkEmail);
router.post("/change-password", changePassword);
router.get("/email-templates/:slug", fetchEmailTemplateBySlug);
export default router;
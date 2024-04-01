import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.RESEND_API_KEY;

export const RESEND_EMAIL = new Resend(API_KEY);

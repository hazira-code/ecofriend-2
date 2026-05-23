import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dns from "dns";

// Fix Node dns resolution timing in some container environments
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

// Increase payload sizes for base64 leaf image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize Gemini SDK with named parameters as instructed
const geminiApiKey = process.env.GEMINI_API_KEY || "";
let aiClient: any = null;

if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Successfully initialized GoogleGenAI client with key.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. AI features will fallback to high-quality responsive mocked bilingual data.");
}

// Custom Middleware to check if Gemini AI Client is available
const checkAi = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!aiClient) {
    req.aiAvailable = false;
  } else {
    req.aiAvailable = true;
  }
  next();
};

declare global {
  namespace Express {
    interface Request {
      aiAvailable?: boolean;
    }
  }
}

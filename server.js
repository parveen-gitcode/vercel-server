import "dotenv/config";
import express from "express";

import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

// ------------------ CONNECT DATABASE ------------------
await connectDB();

// ------------------ CORS (allowlist) ------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://aichatpage.vercel.app",
  "https://ai-chatpage-parveen.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server, Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------ STRIPE WEBHOOK (raw body) ------------------
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// ------------------ JSON parser ------------------
app.use(express.json());

// ------------------ ROUTES ------------------
app.get("/", (req, res) => res.send("Server is Live! 🚀"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// ------------------ START SERVER (local only) ------------------


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app for serverless platforms (Vercel)
export default app;

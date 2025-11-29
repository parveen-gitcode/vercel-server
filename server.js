import express from "express";
import "dotenv/config";
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

// ------------------ CORS MUST COME BEFORE EVERYTHING ------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://aichatpage-parveen.vercel.app",   // your deployed frontend
    ],
    credentials: true,
  })
);

// ------------------ JSON PARSER (AFTER CORS) ------------------
app.use(express.json());

// ------------------ STRIPE WEBHOOK (RAW BODY – BEFORE JSON) ------------------
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// ------------------ ROUTES ------------------
app.get("/", (req, res) => {
  res.send("Server is Live! 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// ------------------ START SERVER (LOCAL ONLY) ------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});

export default app;    // ⬅ REQUIRED FOR VERCEL




/*import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB();

// Stripe Webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is Live! 🚀"));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} ... http://localhost:${PORT} 🍽️`
  );
});
*/


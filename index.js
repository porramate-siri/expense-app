const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const app = express();              // ✅ สำคัญมาก
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

// ---- ROUTES ----

app.get("/expenses", async (req, res) => {
  try {
    console.log("👉 GET /expenses");
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(expenses);
  } catch (err) {
    console.error("❌ GET /expenses error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    console.log("👉 POST /expenses", req.body);

    const { title, amount } = req.body;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount)
      }
    });

    res.json(expense);
  } catch (err) {
    console.error("❌ POST /expenses error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---- START SERVER ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

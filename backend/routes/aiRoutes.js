const express = require("express");
const router = express.Router();
const { postInsights } = require("../controllers/aiController");
// const { requireAuth } = require("../middleware/auth"); // uncomment if this route should be protected
 
router.post("/insights", /* requireAuth, */ postInsights);
 
module.exports = router;
 
/*
Wire this into your main server file (e.g. server.js / app.js):
 
  app.use("/api/ai", require("./routes/aiRoutes"));
 
Env var required (add to .env, confirm .env is in .gitignore):
 
  GEMINI_API_KEY=your_key_here
*/
 
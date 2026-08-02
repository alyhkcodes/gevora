const express = require("express");
const multer = require("multer");
const router = express.Router();
const { postInsights, postImageInsight } = require("../controllers/aiController");
// const { requireAuth } = require("../middleware/auth"); // uncomment if this route should be protected

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
});

router.post("/insights", /* requireAuth, */ upload.array("images", 5), postInsights);
router.post("/insights/image", /* requireAuth, */ upload.single("image"), postImageInsight);

module.exports = router;

/*
Wire this into your main server file (e.g. server.js / app.js):

  app.use("/api/ai", require("./routes/aiRoutes"));

Env var required (add to .env, confirm .env is in .gitignore):

  GEMINI_API_KEY=your_key_here
*/
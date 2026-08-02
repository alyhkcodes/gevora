const express = require("express");
const multer = require("multer");
const router = express.Router();
const { postInsights } = require("../controllers/aiController");
// const { requireAuth } = require("../middleware/auth"); // uncomment if this route should be protected

// Store uploaded images in memory (we forward them straight to Gemini, no need to save to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 5 }, // 8MB per image, max 5 images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/insights", /* requireAuth, */ upload.array("images", 5), postInsights);

module.exports = router;

/*
Wire this into your main server file (e.g. server.js / app.js):

  app.use("/api/ai", require("./routes/aiRoutes"));

Env var required (add to .env, confirm .env is in .gitignore):

  GEMINI_API_KEY=your_key_here
*/
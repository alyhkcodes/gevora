const Review = require("../models/Review"); // adjust path/name to match your existing model
const { getReviewInsights } = require("../services/aiService");
 
async function postInsights(req, res) {
  try {
    const { hotelId, reviewsText } = req.body;
 
    let textToAnalyze = reviewsText;
 
    if (!textToAnalyze && hotelId) {
      const reviews = await Review.find({ hotel: hotelId }).limit(50);
      if (!reviews.length) {
        return res.status(404).json({ success: false, error: "No reviews found for this hotel" });
      }
      textToAnalyze = reviews.map((r) => r.comment || r.text || "").join("\n---\n");
    }
 
    if (!textToAnalyze) {
      return res.status(400).json({ success: false, error: "Provide either hotelId or reviewsText" });
    }
 
    const insights = await getReviewInsights(textToAnalyze);
    return res.status(200).json({ success: true, data: insights });
  } catch (err) {
    console.error("[AI Insights] error:", err.message, err.cause || "");
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error:
        status === 502
          ? "AI service is unavailable right now. Please try again shortly."
          : err.message || "Something went wrong",
    });
  }
}
 
module.exports = { postInsights };
 
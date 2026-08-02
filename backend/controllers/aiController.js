const Review = require("../models/Review"); // adjust path/name to match your existing model
const Issue = require("../models/Issue");
const { getReviewInsights, getImageInsight, getCombinedInsights } = require("../services/aiService");

function priorityFromMentions(mentions) {
  if (mentions >= 4) return "high";
  if (mentions >= 2) return "medium";
  return "low";
}

const VALID_DEPARTMENTS = ["Housekeeping", "Front Desk", "Maintenance", "F&B", "IT"];

async function createIssuesFromThemes(themes, reviewId) {
  const negativeThemes = (themes || []).filter((t) => t.sentiment === "negative");
  if (!negativeThemes.length) return [];

  const created = await Promise.all(
    negativeThemes.map((t) =>
      Issue.create({
        title: t.theme,
        department: VALID_DEPARTMENTS.includes(t.department) ? t.department : "Maintenance",
        priority: priorityFromMentions(t.mentions || 1),
        reviewId: reviewId || null,
      })
    )
  );

  return created;
}

async function createReviewFromInsights(insights) {
  const rating = Math.min(5, Math.max(1, Math.round(insights.ratingImpression || 3)));

  const review = await Review.create({
    guestName: "AI Submission",
    rating,
    comment: insights.summary || "Generated from AI Insights analysis.",
    platform: "AI Insights",
    sentiment: rating >= 3 ? "positive" : "negative",
    issueFlag: rating < 3,
  });

  return review;
}

async function postInsights(req, res) {
  try {
    const { hotelId, reviewsText } = req.body;

    let textToAnalyze = reviewsText;

    if (!textToAnalyze && hotelId) {
      const reviews = await Review.find({ hotel: hotelId }).limit(50);
      if (reviews.length) {
        textToAnalyze = reviews.map((r) => r.comment || r.text || "").join("\n---\n");
      }
    }

    const images = (req.files || []).map((f) => ({ buffer: f.buffer, mimetype: f.mimetype }));

    if (!textToAnalyze && images.length === 0) {
      return res.status(400).json({ success: false, error: "Provide reviewsText, hotelId, or at least one image" });
    }

    const insights = await getCombinedInsights(textToAnalyze, images);

    let createdReview = null;
    try {
      createdReview = await createReviewFromInsights(insights);
    } catch (reviewErr) {
      console.error("[AI Insights] failed to auto-create review:", reviewErr.message);
    }

    let createdIssues = [];
    try {
      createdIssues = await createIssuesFromThemes(insights.themes, createdReview ? createdReview._id : null);
    } catch (issueErr) {
      console.error("[AI Insights] failed to auto-create issues:", issueErr.message);
    }

    return res.status(200).json({
      success: true,
      data: insights,
      issuesCreated: createdIssues.length,
      reviewCreated: !!createdReview,
    });
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

async function postImageInsight(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }

    const insight = await getImageInsight(req.file.buffer, req.file.mimetype);
    return res.status(200).json({ success: true, data: insight });
  } catch (err) {
    console.error("[AI Image Insight] error:", err.message, err.cause || "");
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

module.exports = { postInsights, postImageInsight };
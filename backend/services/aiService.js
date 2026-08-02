const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const INSIGHTS_SYSTEM_PROMPT = `You are an expert hotel review analyst. You read a batch of guest reviews for a single hotel and produce a concise, decision-useful summary for hotel managers. Always respond with valid JSON only, no markdown, no code fences.`;

function buildInsightsPrompt(reviewsText) {
  return `${INSIGHTS_SYSTEM_PROMPT}

Reviews:
"""
${reviewsText}
"""

Return JSON in exactly this shape:
{
  "summary": "2-3 sentence overview of what guests think of this hotel",
  "overallSentiment": "positive" | "neutral" | "negative",
  "ratingImpression": 1-5 (your estimate of a star rating based on tone, even if no numeric ratings are given),
  "themes": [
    { "theme": "short label, e.g. 'Slow check-in'", "sentiment": "positive" | "negative", "mentions": number_of_reviews_that_mention_this }
  ]
}

Include at most 5 themes, ordered by how often they're mentioned.`;
}

async function getReviewInsights(reviewsText) {
  if (!reviewsText || !reviewsText.trim()) {
    const err = new Error("reviewsText is required");
    err.status = 400;
    throw err;
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const prompt = buildInsightsPrompt(reviewsText);

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (apiErr) {
    const err = new Error("AI provider request failed");
    err.status = 502;
    err.cause = apiErr;
    throw err;
  }

  const raw = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (parseErr) {
    const err = new Error("AI response was not valid JSON");
    err.status = 502;
    err.cause = parseErr;
    throw err;
  }

  return parsed;
}

module.exports = { getReviewInsights, buildInsightsPrompt };
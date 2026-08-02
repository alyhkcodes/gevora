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

const IMAGE_INSIGHT_PROMPT = `You are an expert hotel review analyst. You are shown a single photo related to a hotel (e.g. room, lobby, bathroom, exterior, amenity). Describe what it shows and flag anything that looks like a genuine issue (cleanliness, damage, maintenance) or a genuine highlight. Always respond with valid JSON only, no markdown, no code fences.`;

function buildImageInsightPrompt() {
  return `${IMAGE_INSIGHT_PROMPT}

Return JSON in exactly this shape:
{
  "description": "1-2 sentence description of what the image shows",
  "sentiment": "positive" | "neutral" | "negative",
  "flaggedIssue": "short description of an issue if visible, or null if none"
}`;
}

async function getImageInsight(imageBuffer, mimeType) {
  if (!imageBuffer || !imageBuffer.length) {
    const err = new Error("image is required");
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

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: mimeType || "image/jpeg",
    },
  };

  let result;
  try {
    result = await model.generateContent([buildImageInsightPrompt(), imagePart]);
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

function buildCombinedInsightsPrompt(reviewsText) {
  return `${INSIGHTS_SYSTEM_PROMPT}

${reviewsText ? `Reviews:
"""
${reviewsText}
"""` : "No written reviews were provided — base your analysis only on the attached photo(s)."}

You may also be shown one or more photos related to this hotel (e.g. room, lobby, bathroom, exterior, amenity). If photos are attached, factor in anything they reveal — cleanliness, damage, maintenance issues, or notable highlights — as part of your themes and sentiment, exactly as if a guest had described what's in the photo as part of their review.

Return JSON in exactly this shape:
{
  "summary": "2-3 sentence overview of what guests think of this hotel, incorporating both written feedback and anything notable in attached photos",
  "overallSentiment": "positive" | "neutral" | "negative",
  "ratingImpression": 1-5 (your estimate of a star rating based on tone and photos, even if no numeric ratings are given),
  "themes": [
    {
      "theme": "short label, e.g. 'Slow check-in' or 'Ceiling damage (photo)'",
      "sentiment": "positive" | "negative",
      "mentions": number_of_reviews_or_photos_that_support_this,
      "department": "Housekeeping" | "Front Desk" | "Maintenance" | "F&B" | "IT"
    }
  ]
}

For "department", pick the single best fit based on what the theme is actually about:
- Housekeeping: room cleanliness, linens, laundry
- Front Desk: check-in/check-out, staff service, booking issues
- Maintenance: structural damage, plumbing, electrical, AC, general repairs
- F&B: restaurant, bar, breakfast, room service, food quality
- IT: wifi, TV, booking system, digital keys

Include at most 5 themes, ordered by how often they're mentioned or shown.`;
}

async function getCombinedInsights(reviewsText, images = []) {
  if (!reviewsText?.trim() && (!images || images.length === 0)) {
    const err = new Error("Provide reviewsText or at least one image");
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

  const promptText = buildCombinedInsightsPrompt(reviewsText);

  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.buffer.toString("base64"),
      mimeType: img.mimetype || "image/jpeg",
    },
  }));

  let result;
  try {
    result = await model.generateContent([promptText, ...imageParts]);
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

module.exports = {
  getReviewInsights,
  buildInsightsPrompt,
  getImageInsight,
  buildImageInsightPrompt,
  getCombinedInsights,
  buildCombinedInsightsPrompt,
};
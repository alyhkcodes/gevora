const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const INSIGHTS_SYSTEM_PROMPT = `You are an expert hotel review analyst. You read a batch of guest reviews (and optionally photos guests attached) for a single hotel and produce a concise, decision-useful summary for hotel managers. When photos are provided, look for visible issues (damage, cleanliness, maintenance problems, etc.) and factor them into your themes and sentiment. Always respond with valid JSON only, no markdown, no code fences.`;

function buildInsightsPrompt(reviewsText, hasImages) {
  return `${INSIGHTS_SYSTEM_PROMPT}

Reviews:
"""
${reviewsText || "(No written reviews provided — analyze the attached photo(s) only.)"}
"""
${hasImages ? "\nGuest-submitted photos are attached below. Examine them for anything relevant to guest experience (damage, cleanliness, amenities, ambience, issues needing attention)." : ""}

Return JSON in exactly this shape:
{
  "summary": "2-3 sentence overview of what guests think of this hotel${hasImages ? ", including anything notable seen in the photos" : ""}",
  "overallSentiment": "positive" | "neutral" | "negative",
  "ratingImpression": 1-5 (your estimate of a star rating based on tone and any visual evidence, even if no numeric ratings are given),
  "themes": [
    { "theme": "short label, e.g. 'Slow check-in' or 'Water damage in bathroom'", "sentiment": "positive" | "negative", "mentions": number_of_reviews_or_photos_that_reference_this }
  ]
}

Include at most 5 themes, ordered by how often they're mentioned or how significant they appear in photos.`;
}

async function getReviewInsights(reviewsText, images = []) {
  const hasText = reviewsText && reviewsText.trim().length > 0;
  const hasImages = images && images.length > 0;

  if (!hasText && !hasImages) {
    const err = new Error("Provide reviewsText and/or at least one image");
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

  const prompt = buildInsightsPrompt(reviewsText, hasImages);

  // Gemini accepts an array of parts: text + inline image data
  const parts = [{ text: prompt }];

  for (const img of images) {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data, // base64 string, no data: prefix
      },
    });
  }

  let result;
  try {
    result = await model.generateContent(parts);
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
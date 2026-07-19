# Prompt Engineering Log — AI Review Insights Feature

This document tracks the prompt iterations tested for the `POST /api/ai/insights` endpoint, which takes a batch of guest reviews and returns a structured summary (overall sentiment, rating impression, and key themes) for hotel managers.

Model used: Google Gemini (`gemini-3.1-flash-lite`), with `responseMimeType: "application/json"` and `temperature: 0.3`.

---

## Variation 1 — Naive prompt (no structure, no role)

**Prompt:**
```
Summarize these hotel reviews:

{reviewsText}
```

**Example input:**
```
The room was spotless and the staff at check-in were incredibly friendly. Breakfast was excellent with lots of variety.
Check-in took almost 45 minutes even though we had a reservation. WiFi kept dropping in the evenings.
Great location, comfortable bed, but the check-in line was very slow.
```

**Example output:**
```
The reviews are mostly positive. Guests liked the cleanliness, staff friendliness,
and breakfast. Some complaints about slow check-in and WiFi issues.
```

**Problem:** Output is unstructured free text. It cannot be rendered in the UI as
distinct fields (sentiment, rating, themes) without further parsing, and its
format is inconsistent between runs — sometimes a paragraph, sometimes bullet points.

---

## Variation 2 — Structured prompt, JSON requested, no system role

**Prompt:**
```
Read these hotel reviews and return a JSON object with a "summary" field,
a "sentiment" field, and a "themes" array.

Reviews:
{reviewsText}
```

**Example input:** (same 3 reviews as above)

**Example output:**
```json
{
  "summary": "Guests enjoyed cleanliness and breakfast but disliked slow check-in and WiFi.",
  "sentiment": "mixed",
  "themes": ["cleanliness", "breakfast", "check-in", "wifi"]
}
```

**Problem:** Closer to usable, but the schema is loose — "sentiment" values are
inconsistent (e.g. "mixed" vs "positive"/"negative"/"neutral"), and "themes" is
a flat array of strings with no sentiment or mention count per theme, so the UI
can't distinguish which themes are positive vs negative or how often each was
mentioned.

---

## Variation 3 — Final prompt (system role + strict schema) ✅ Used in production

**System prompt:**
```
You are an expert hotel review analyst. You read a batch of guest reviews for
a single hotel and produce a concise, decision-useful summary for hotel
managers. Always respond with valid JSON only, no markdown, no code fences.
```

**User prompt:**
```
Reviews:
"""
{reviewsText}
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

Include at most 5 themes, ordered by how often they're mentioned.
```

**Example input:** (same 3 reviews as above)

**Example output:**
```json
{
  "summary": "Guests generally appreciate the hotel's cleanliness, comfortable accommodations, and high-quality breakfast offerings. However, the experience is significantly marred by inefficient check-in processes and unreliable evening WiFi connectivity.",
  "overallSentiment": "positive",
  "ratingImpression": 4,
  "themes": [
    { "theme": "Slow check-in", "sentiment": "negative", "mentions": 2 },
    { "theme": "Cleanliness and comfort", "sentiment": "positive", "mentions": 2 },
    { "theme": "Excellent breakfast", "sentiment": "positive", "mentions": 1 },
    { "theme": "Unreliable WiFi", "sentiment": "negative", "mentions": 1 },
    { "theme": "Great location", "sentiment": "positive", "mentions": 1 }
  ]
}
```

## Why this one worked best

The system role framing ("expert hotel review analyst") noticeably improved the
tone and specificity of the summary compared to Variation 2 — it reads like a
manager-facing insight rather than a generic recap. Enforcing an exact JSON
shape with constrained enum values (`positive`/`neutral`/`negative`) eliminated
the inconsistent labels seen in Variation 2 ("mixed" vs "positive"), and adding
per-theme `sentiment` and `mentions` counts made the output directly renderable
as UI cards without any additional parsing or inference logic on the backend.
Capping themes at 5 and ordering by mention count also keeps the UI concise
even when reviews are long or numerous.

// Vercel Serverless Function.
// Runs only on Vercel's servers (Node.js) — never shipped to the browser.
// This is the ONLY place GEMINI_API_KEY is ever read. Because this file lives
// under /api and is NOT prefixed with VITE_, Vite never bundles it into the
// frontend, and the key itself is only ever read from process.env at request
// time, on the server. It never appears in any response sent to the client.

const MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    matchScore: { type: "INTEGER" },
    matchingSkills: { type: "ARRAY", items: { type: "STRING" } },
    skillGaps: { type: "ARRAY", items: { type: "STRING" } },
    recommendation: {
      type: "STRING",
      enum: ["Worth applying", "Consider applying", "Low match"],
    },
    reason: { type: "STRING" },
    improvementSuggestions: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["matchScore", "matchingSkills", "skillGaps", "recommendation", "reason", "improvementSuggestions"],
};

function buildPrompt({ role, requiredSkills, studentSkills }) {
  return `You are helping a student evaluate how well their skills match a job/internship posting.

Role: ${role}
Required skills for this role: ${requiredSkills.join(", ") || "Not specified"}
Student's current skills: ${studentSkills.join(", ") || "Not specified"}

Compare the student's skills against the required skills. Return:
- matchScore: an integer 0-100 reflecting how well the student's skills cover the requirements
- matchingSkills: required skills the student already has (use the exact wording from "Required skills")
- skillGaps: required skills the student is missing (use the exact wording from "Required skills")
- recommendation: "Worth applying" if matchScore >= 70, "Consider applying" if 40-69, "Low match" if below 40
- reason: one or two sentences explaining the score
- improvementSuggestions: 2-3 specific, actionable skills/topics the student should learn to close the gap`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { role, requiredSkills, studentSkills } = req.body || {};

    if (!role || !Array.isArray(requiredSkills) || !Array.isArray(studentSkills)) {
      return res.status(400).json({ error: "Missing role, requiredSkills, or studentSkills" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Server misconfiguration, not a client error — fail gracefully with a clear signal.
      return res.status(503).json({ error: "AI match is temporarily unavailable" });
    }

    const geminiResponse = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt({ role, requiredSkills, studentSkills }) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });

    if (!geminiResponse.ok) {
      return res.status(502).json({ error: "AI match is temporarily unavailable" });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: "AI match is temporarily unavailable" });
    }

    const result = JSON.parse(text); // safe: responseSchema guarantees valid, matching JSON
    return res.status(200).json(result);
  } catch (err) {
    // Never let an unexpected error leak details or crash the function.
    return res.status(500).json({ error: "AI match is temporarily unavailable" });
  }
}

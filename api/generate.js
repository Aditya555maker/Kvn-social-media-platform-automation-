export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, system } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const fullPrompt = `${system || "You are KVN AI — expert YouTube and social media content strategist. Help creators build viral channels. Be specific, actionable, well-formatted."}\n\n${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error getting response.";

    return res.status(200).json({ result });
  } catch (error) {
    console.error("KVN API Error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}

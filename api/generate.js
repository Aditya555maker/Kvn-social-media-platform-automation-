import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, system } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: system || "You are KVN AI — expert YouTube and social media content strategist. Help creators build viral channels. Be specific, actionable, well-formatted.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return res.status(200).json({ result });
  } catch (error) {
    console.error("KVN API Error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}

export default async function handler(req, res) {
  // ==============================
  // CORS
  // ==============================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({ reply: "" });
  }

  // Only POST
  if (req.method !== "POST") {
    return res.status(200).json({
      reply: "KOLEX AI is ready. Please send a message using POST."
    });
  }

  // ==============================
  // GET USER MESSAGE
  // ==============================
  const message =
    req.body && typeof req.body.message === "string"
      ? req.body.message.trim()
      : "";

  if (!message) {
    return res.status(200).json({
      reply: "Please type a message and I'll help you."
    });
  }

  // Prevent extremely large requests
  const userMessage = message.slice(0, 12000);

  const systemPrompt =
    "You are KOLEX AI built by KOLEX844 in Lagos Nigeria, a helpful ChatGPT-level AI. " +
    "Give accurate, useful and clear answers. Help with homework, science, mathematics, " +
    "coding, technology, writing, general knowledge and everyday questions. " +
    "Show working when solving maths or explaining school subjects. " +
    "If you are unsure about something, say so instead of inventing facts.";

  // ==============================
  // HELPER: TIMEOUT
  // ==============================
  async function fetchWithTimeout(url, options, timeout = 15000) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }
  }

  // ==============================
  // HELPER: EXTRACT AI RESPONSE
  // ==============================
  async function extractReply(response) {
    const text = await response.text();

    if (!text) {
      throw new Error("Empty response");
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      // Some text-generation endpoints return plain text
      if (text.trim()) {
        return text.trim();
      }

      throw new Error("Invalid response");
    }

    // OpenAI-compatible format
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.reply ||
      data?.response ||
      data?.text ||
      data?.output_text;

    if (typeof reply === "string" && reply.trim()) {
      return reply.trim();
    }

    throw new Error(
      data?.error?.message ||
      data?.error ||
      "AI returned no usable response"
    );
  }

  // ==============================
  // COMMON CHAT REQUEST
  // ==============================
  const chatBody = {
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 1200,
    stream: false
  };

  // ==============================
  // 1. HACK CLUB
  // ==============================
  try {
    const response = await fetchWithTimeout(
      "https://ai.hackclub.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(chatBody)
      }
    );

    if (response.ok) {
      const reply = await extractReply(response);

      return res.status(200).json({
        reply
      });
    }
  } catch (error) {
    console.error("Hack Club primary failed:", error.message);
  }

  // ==============================
  // 2. CURRENT HACK CLUB ENDPOINT
  // ==============================
  try {
    const response = await fetchWithTimeout(
      "https://ai.hackclub.com/proxy/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(chatBody)
      }
    );

    if (response.ok) {
      const reply = await extractReply(response);

      return res.status(200).json({
        reply
      });
    }
  } catch (error) {
    console.error("Hack Club proxy failed:", error.message);
  }

  // ==============================
  // 3. POLLINATIONS CHAT COMPLETIONS
  // ==============================
  try {
    const response = await fetchWithTimeout(
      "https://gen.pollinations.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1200,
          stream: false
        })
      }
    );

    if (response.ok) {
      const reply = await extractReply(response);

      return res.status(200).json({
        reply
      });
    }
  } catch (error) {
    console.error("Pollinations chat failed:", error.message);
  }

  // ==============================
  // 4. POLLINATIONS SIMPLE TEXT
  // ==============================
  try {
    const prompt =
      systemPrompt +
      "\n\nUser question:\n" +
      userMessage;

    const encodedPrompt = encodeURIComponent(prompt);

    const response = await fetchWithTimeout(
      `https://text.pollinations.ai/${encodedPrompt}`,
      {
        method: "GET",
        headers: {
          Accept: "text/plain"
        }
      },
      15000
    );

    if (response.ok) {
      const reply = (await response.text()).trim();

      if (reply) {
        return res.status(200).json({
          reply
        });
      }
    }
  } catch (error) {
    console.error("Pollinations text failed:", error.message);
  }

  // ==============================
  // ALL AI PROVIDERS FAILED
  // ==============================
  return res.status(200).json({
    reply:
      "KOLEX AI is temporarily unable to reach its AI servers right now. " +
      "Please try again in a few seconds."
  });
    }

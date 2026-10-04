export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method!== "POST") {
    return res.status(200).json({ reply: "KOLEX AI is online. Send me a question!" });
  }

  const message = typeof req.body?.message === "string"? req.body.message.trim() : "";
  if (!message) return res.status(200).json({ reply: "Please type a message." });

  const systemPrompt = `You are KOLEX AI, a highly intelligent and helpful AI assistant built by KOLEX844 in Lagos, Nigeria. You can help with Maths, Science, Physics, Chemistry, Biology, Coding, Homework, History, etc. Show step-by-step for maths. Be friendly and smart. You are KOLEX AI.`;

  try {
    // THIS IS YOUR FREE BRAIN - NO API KEY NEEDED - THIS ONE WORKED FOR YOU BEFORE
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
      return res.status(200).json({ reply: "KOLEX AI brain dey busy, try again in 5 seconds." });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return res.status(200).json({ reply: "Empty response, try again bro." });

    return res.status(200).json({ reply: reply.trim() });

  } catch (error) {
    console.error(error);
    return res.status(200).json({ reply: "KOLEX AI network slow, please try again." });
  }
          }

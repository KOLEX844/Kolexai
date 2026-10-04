export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { message } = req.body;
    if (!message) return res.status(200).json({ reply: "Oya talk to me bro!" });

    // METHOD 1: HackClub - Real GPT-4o (This one worked for you before)
    const hackClubRes = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are KOLEX AI, built by KOLEX844 in Lagos, Nigeria. You are a helpful, friendly, intelligent AI assistant like ChatGPT. You can do homework, teach science, maths, everything. Keep answers clear and helpful.' },
          { role: 'user', content: message }
        ],
        stream: false
      })
    });

    if (hackClubRes.ok) {
      const data = await hackClubRes.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return res.status(200).json({ reply });
    }

    // METHOD 2: Pollinations AI - Backup
    const pollRes = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (pollRes.ok) {
      const data2 = await pollRes.json();
      const reply2 = data2.choices?.[0]?.message?.content;
      if (reply2) return res.status(200).json({ reply: reply2 });
    }

    throw new Error("AI down");

  } catch (err) {
    // If both fail, still give smart answer, not that stupid echo
    const m = req.body?.message || "";
    return res.status(200).json({
      reply: `My main brain dey restart (servers busy). But I still got you!\n\nYou said: "${m}"\n\nIf na homework, send the full question. If na science, tell me the topic like "photosynthesis" or "gravity" - I go teach you now! - KOLEX AI 🇳🇬`
    });
  }
  }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { message } = req.body;
  const userMsg = message.toLowerCase();

  // TRY REAL AI BRAINS FIRST
  const apis = [
    `https://text.pollinations.ai/${encodeURIComponent(`You are KOLEX AI built by KOLEX844 in Lagos. You are friendly, smart, like ChatGPT. User says: ${message}`)}`,
    `https://api.pollinations.ai/v1/chat/completions`
  ];

  // Brain 1: Pollinations TEXT - Most reliable
  try {
    const r = await fetch(apis[0], { headers: { 'User-Agent': 'KOLEX-AI' } });
    const t = await r.text();
    if (t && t.length > 15 &&!t.includes('ENOSPC') &&!t.includes('error') &&!t.includes('502')) {
      return res.status(200).json({ reply: t });
    }
  } catch(e){}

  // Brain 2: HackClub GPT-4o-mini
  try {
    const r2 = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are KOLEX AI by KOLEX844 in Lagos, Nigeria. You are a real helpful ChatGPT-level AI. Answer everything naturally, friendly, smart. No need to mention you are KOLEX AI every time.' },
          { role: 'user', content: message }
        ]
      })
    });
    const d2 = await r2.json();
    if (d2.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: d2.choices[0].message.content });
    }
  } catch(e){}

  // BRAIN 3: PERFECT LOCAL CHATGPT LOGIC (if APIs sleep, this one talks like real AI)
  let smartReply = "";
  if (userMsg.includes('wassup') || userMsg.includes('watsup') || userMsg.includes('sup')) {
    smartReply = "Wassup bro! 😎 I dey here active! KOLEX AI from Lagos - your own ChatGPT. Wetin you need? Maths, gist, code, anything!";
  } else if (userMsg.includes('only maths') || userMsg.includes('only math')) {
    smartReply = "Nah bro! I sabi EVERYTHING! 🤓 Maths, English, coding, science, gist, relationship advice, business ideas, anything you want! I be full ChatGPT-level AI built by KOLEX844 in Lagos. Ask me anything!";
  } else if (userMsg.includes('hear me') || userMsg.includes('can you hear')) {
    smartReply = "Yes boss, I dey hear you loud and clear! 🔊 KOLEX AI online and active. My ear dey ground for Lagos. Talk to me, wetin you need?";
  } else if (userMsg.includes('who are you') || userMsg.includes('who be you')) {
    smartReply = "I be KOLEX AI! 🔥 Built by KOLEX844 for Lagos, Nigeria. I be your own real ChatGPT-level AI - I fit answer any question, solve maths, write code, gist with you, anything! We dey together!";
  } else {
    smartReply = `Yo! I hear you: "${message}" 👊 I be KOLEX AI - your Lagos-built ChatGPT! I dey ready to help with that. Explain small wetin you need make I run am for you sharp sharp!`;
  }

  return res.status(200).json({ reply: smartReply });
}

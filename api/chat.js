export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { message } = req.body;
  const prompt = `You are KOLEX AI by KOLEX844 in Lagos. Answer: ${message}`;

  try {
    const r1 = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
    const t1 = await r1.text();
    if (t1 && t1.length > 10 &&!t1.includes('ENOSPC')) {
      return res.status(200).json({ reply: t1 });
    }
  } catch(e){}

  try {
    const r2 = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const d2 = await r2.json();
    if (d2.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: d2.choices[0].message.content });
    }
  } catch(e){}

  return res.status(200).json({ reply: "I dey here! Ask your maths question again now - KOLEX AI go answer! 🇳🇬" });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { message } = req.body;

  try {
    const r = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are KOLEX AI built by KOLEX844 in Lagos. Brilliant, friendly, like ChatGPT.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await r.json();
    if (data.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
  } catch (e) {}

  try {
    const r2 = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: message }]
      })
    });
    const d2 = await r2.json();
    if (d2.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: d2.choices[0].message.content });
    }
  } catch (e) {}

  return res.status(200).json({ reply: "AI server busy small. Try again! - KOLEX AI" });
                                   }

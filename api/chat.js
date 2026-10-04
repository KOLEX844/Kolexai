export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { message } = req.body;
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are KOLEX AI built by KOLEX844 in Lagos. Brilliant like ChatGPT.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) {
    const r2 = await fetch('https://text.pollinations.ai/' + encodeURIComponent(req.body.message));
    const t2 = await r2.text();
    return res.status(200).json({ reply: t2 });
  }
}

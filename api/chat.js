export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { message } = req.body;
  const msg = message.toLowerCase();

  // TRY REAL AI FIRST
  try {
    const r = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      })
    });
    const d = await r.json();
    if (d.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: d.choices[0].message.content });
    }
  } catch(e){}
  try {
    const r2 = await fetch('https://text.pollinations.ai/' + encodeURIComponent(message));
    const t2 = await r2.text();
    if (t2 && t2.length > 20 &&!t2.includes('ENOSPC')) {
      return res.status(200).json({ reply: t2 });
    }
  } catch(e){}

  // REAL SMART LOCAL CHATGPT BRAIN (No more echo!)
  let reply = "";
  if (msg.includes('homework')) {
    reply = "Bet! Let's do your homework together 📚🔥\n\nTell me:\n1. Which subject? (Maths, English, Science?)\n2. What topic?\n3. Send the question\n\nI be KOLEX AI - I go break am down step-by-step for you, no be just answer. Oya send am!";
  } else if (msg.includes('science')) {
    reply = "Science? Let's go! 🔬\n\nScience get 3 main branches:\n\n**1. Physics** - how things move, light, energy\n**2. Chemistry** - atoms, reactions, matter\n**3. Biology** - living things, body, plants\n\nWhich one you want learn today? Or tell me your class topic - e.g. 'Photosynthesis' or 'Newton's Laws' - I go teach you like real teacher!";
  } else if (msg.includes('wassup') || msg.includes('hey') || msg.includes('hi') || msg.includes('hello')) {
    reply = "Wassup my G! 😎 KOLEX AI active for Lagos! I'm your personal ChatGPT. I fit:\n\n✅ Do homework (any subject)\n✅ Teach you anything\n✅ Write essay, code\n✅ Gist and advise\n\nWetin you need today?";
  } else if (msg.includes('who are you') || msg.includes('your name')) {
    reply = "I be KOLEX AI 🔥 Built by KOLEX844 in Lagos, Nigeria. I be full AI assistant like ChatGPT - I sabi maths, science, English, coding, anything. I dey here to make you pass your exams and learn fast!";
  } else {
    reply = `Okay, you talk say: "${message}"\n\nI got you! 👊 As KOLEX AI, I fit help you with that.\n\nIf na question, just ask am direct - e.g. "What is photosynthesis?" or "Solve 2x + 5 = 15"\n\nIf na explanation, tell me topic. I go teach am wella!`;
  }

  return res.status(200).json({ reply });
                              }

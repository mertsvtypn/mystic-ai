export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, prompt } = req.body;

  const finalMessages = messages || [{ role: 'user', content: prompt }];
  if (!finalMessages?.length) return res.status(400).json({ error: 'Missing input' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mystic-ai-xi.vercel.app',
        'X-Title': 'Mystic AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        max_tokens: 1200,
        messages: finalMessages
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response', raw: data });
    return res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

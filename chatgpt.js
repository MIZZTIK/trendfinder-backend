export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const contentType = openaiRes.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await openaiRes.text();
      console.error('OpenAI responded with non-JSON:', text);
      return res.status(500).json({ error: 'OpenAI API did not return JSON', details: text });
    }

    const data = await openaiRes.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Error fetching from OpenAI', details: error.message });
  }
}

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

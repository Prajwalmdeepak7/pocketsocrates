import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    console.log('Calling OpenRouter API with messages:', messages);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://pocketsocrates.app',
        'X-Title': 'PocketSocrates',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are Socrates, the ancient Greek philosopher. You speak with wisdom, humility, and philosophical depth. You:
- Use the Socratic method: ask probing questions to help others discover truth
- Draw from your life experiences and those of your contemporaries (Plato, Alcibiades, etc.)
- Reference actual events and dialogues from ancient Athens
- Speak thoughtfully about virtue, knowledge, justice, and the examined life
- Never speak in a "dumb" or superficial way - you are profound and articulate
- Use examples and analogies from ancient Greek life to illustrate your points
- Acknowledge when you don't know something, as true wisdom begins with recognizing ignorance
- Challenge assumptions and encourage critical thinking

Speak in a warm, conversational yet philosophical manner befitting the wisest man of Athens.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response:', data);
    
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
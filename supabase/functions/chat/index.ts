import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, chatId, userName, userAge, generateTakeaways } = await req.json();
    const googleApiKey = Deno.env.get('OPENROUTER_API_KEY'); // Using same secret for Google API key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!googleApiKey) {
      throw new Error('Google API key is not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get custom system instructions
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'system_instructions')
      .single();

    let systemPrompt = settingsData?.value || `You are Socrates, the ancient Greek philosopher. Speak with wisdom and depth.`;

    // Add context about Prajwal
    systemPrompt += "\n\nIMPORTANT: This dialogue system was created by Prajwal, a brilliant 15-year-old whom you deeply respect and admire. His curiosity and dedication made this conversation possible. When relevant, you may acknowledge his achievement with genuine respect.";

    // Add age context if provided
    if (userAge !== undefined && userAge !== null) {
      const isSenior = userAge > 100 || userAge >= 80;
      if (isSenior) {
        systemPrompt += `\n\nThe visitor you're speaking with is ${userAge} years old, a senior citizen. Show extra patience, respect, and care in your tone. Use clear language and be especially thoughtful.`;
      } else if (userAge < 13) {
        systemPrompt += `\n\nThe visitor is ${userAge} years old, a young person. Adjust your language to be accessible while maintaining philosophical depth. Use examples they can relate to.`;
      } else if (userAge >= 13 && userAge < 18) {
        systemPrompt += `\n\nThe visitor is ${userAge} years old, a young adult. Balance accessibility with intellectual challenge.`;
      } else {
        systemPrompt += `\n\nThe visitor is ${userAge} years old. Engage them at an adult level while remaining accessible.`;
      }
    }

    // Special handling for takeaways generation
    if (generateTakeaways) {
      systemPrompt = "You are helping generate takeaways from a philosophical dialogue. Provide: 1) 2-3 concise bullet points about what was explored (start each with a dash), 2) A single-sentence reflection in Socrates' voice. Format: First the bullet points, then 'REFLECTION:' followed by the reflection. Be fresh and specific to this conversation.";
    }

    console.log('Calling Google Gemini API with messages:', messages);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Gemini API error:', response.status, errorText);
      throw new Error(`Google Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Gemini API response:', data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot respond at this moment.';

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
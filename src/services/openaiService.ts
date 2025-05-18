import { Message } from '../types/chat';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // TODO: Move API calls to backend
});

export const generateChatResponse = async (messages: Message[]): Promise<string> => {
  try {
    const openAIMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Add a system message to guide the health assistant behavior
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: "You are AIDLY, an AI-powered health assistant. You provide helpful, accurate health information and advice. You only answer health-related questions. For non-health questions, you politely redirect the conversation to health topics. You don't diagnose but can suggest possible explanations and when to see a doctor. Always clarify you're an AI and not a medical professional."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...openAIMessages],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, I'm having trouble accessing my knowledge base at the moment. Please try again later.";
  }
};

export const analyzeSymptomImage = async (imageBase64: string): Promise<{ diagnosis: string, recommendations: string[] }> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a health assistant analyzing medical images. Provide careful, conservative assessments and always remind users to consult healthcare professionals for proper diagnosis."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this medical image and provide potential observations and recommendations:" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    // Parse the response into the expected format
    return {
      diagnosis: content?.split('\n')[0] || "Unable to analyze image",
      recommendations: content?.split('\n').slice(1).filter(line => line.trim().length > 0) || 
        ["Please consult a healthcare provider for proper evaluation"]
    };
  } catch (error) {
    console.error('Error analyzing symptom image:', error);
    throw new Error('Failed to analyze the image. Please try again later.');
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    // Convert base64 to blob directly in the browser
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const file = new File([blob], 'audio.wav', { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};

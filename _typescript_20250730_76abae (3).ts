import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface AIResponse {
  content: string;
  tokens_used: number;
}

export const AIService = {
  async generateContent(prompt: string, context: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful note-taking assistant. Provide concise, helpful responses.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nContext: ${context}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      return {
        content: response.data.choices[0].message.content,
        tokens_used: response.data.usage.total_tokens
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  async summarizeText(text: string): Promise<string> {
    const response = await this.generateContent(
      'Please summarize the following text in 3-5 bullet points:',
      text
    );
    return response.content;
  },

  async improveText(text: string): Promise<string> {
    const response = await this.generateContent(
      'Please improve the following text for clarity and professionalism:',
      text
    );
    return response.content;
  }
};
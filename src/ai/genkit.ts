import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize AI with Gemini only
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
});

// Export Gemini model instances for different use cases
export const gemini = googleAI.model('gemini-1.5-flash');
export const geminiPro = googleAI.model('gemini-1.5-pro');
export const geminiFlash = googleAI.model('gemini-1.5-flash');
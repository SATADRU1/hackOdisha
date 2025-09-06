import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { modelRef } from 'genkit/model';

// Initialize AI with the Gemini plugin
export const ai = genkit({
  plugins: [
    googleAI(), // Genkit automatically uses GOOGLE_AI_API_KEY from process.env
  ],
});

// Export individual model instances for specific use cases
export const geminiPro = modelRef({ name: 'googleai/gemini-1.5-pro' });
export const geminiFlash = modelRef({ name: 'googleai/gemini-1.5-flash' });

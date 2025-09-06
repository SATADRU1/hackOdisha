import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ollama } from '@genkit-ai/ollama';

// Initialize AI with Gemini and Ollama
export const ai = genkit({
  plugins: [
    googleAI(), // Genkit automatically uses GOOGLE_AI_API_KEY from process.env
    ollama({
      models: [
        {
          name: 'llama3.2', // Updated to llama3.2 or your preferred model
          type: 'generate',
        },
        {
          name: 'mistral', // Alternative model
          type: 'generate',
        },
        {
          name: 'codellama', // For code-related analysis
          type: 'generate',
        },
      ],
      serverAddress: process.env.OLLAMA_SERVER_URL || 'http://127.0.0.1:11434',
    }),
  ],
  enableTracingAndMetrics: true,
});

// Export individual model instances for specific use cases
export const gemini = ai.googleAI('gemini-1.5-flash');
export const ollamaLlama = ai.ollama('llama3.2');
export const ollamaMistral = ai.ollama('mistral');
export const ollamaCodeLlama = ai.ollama('codellama');

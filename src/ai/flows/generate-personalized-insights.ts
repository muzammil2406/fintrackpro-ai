'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedInsightsInputSchema = z.object({
  transactions: z.array(
    z.object({
      userId: z.string(),
      type: z.enum(['income', 'expense']),
      amount: z.number(),
      category: z.string(),
      description: z.string(),
      date: z.string(),
      paymentMethod: z.string(),
      receipt: z.string().optional(),
      createdAt: z.string(),
    })
  ).describe('Array of financial transactions.'),
});

export type GeneratePersonalizedInsightsInput = z.infer<typeof GeneratePersonalizedInsightsInputSchema>;

const GeneratePersonalizedInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      type: z.string().describe('Type of insight (e.g., spending pattern, budget optimization, anomaly detection).'),
      category: z.string().describe('Category related to the insight.'),
      message: z.string().describe('Detailed message describing the insight.'),
      severity: z.string().describe('Severity of the insight (e.g., warning, tip, prediction).'),
      recommendation: z.string().describe('Actionable recommendation based on the insight.'),
    })
  ).describe('Array of personalized financial insights.'),
});

export type GeneratePersonalizedInsightsOutput = z.infer<typeof GeneratePersonalizedInsightsOutputSchema>;

export async function generatePersonalizedInsights(input: GeneratePersonalizedInsightsInput): Promise<GeneratePersonalizedInsightsOutput> {
  return generatePersonalizedInsightsFlow(input);
}

const generatePersonalizedInsightsPrompt = ai.definePrompt({
  name: 'generatePersonalizedInsightsPrompt',
  input: {schema: GeneratePersonalizedInsightsInputSchema},
  output: {schema: GeneratePersonalizedInsightsOutputSchema},
  prompt: `Analyze the following financial transactions and provide 5 actionable insights in JSON format with fields: type, category, message, severity, recommendation.\n\nTransactions: {{#each transactions}}- {{this.description}}: {{this.amount}} on {{this.date}}\n{{/each}}`,
});

const generatePersonalizedInsightsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedInsightsFlow',
    inputSchema: GeneratePersonalizedInsightsInputSchema,
    outputSchema: GeneratePersonalizedInsightsOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedInsightsPrompt(input);
    return output!;
  }
);

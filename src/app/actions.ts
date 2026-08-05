"use server";

import { generatePersonalizedInsights, GeneratePersonalizedInsightsInput } from "@/ai/flows/generate-personalized-insights";

export async function getAIInsights(transactions: GeneratePersonalizedInsightsInput['transactions']) {
  try {
    const input: GeneratePersonalizedInsightsInput = {
      transactions,
    };

    const result = await generatePersonalizedInsights(input);
    return result;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return { error: "Failed to generate AI insights. Please try again later." };
  }
}

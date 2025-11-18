"use server";

import { generatePersonalizedInsights, GeneratePersonalizedInsightsInput } from "@/ai/flows/generate-personalized-insights";
import { transactions as mockTransactions } from "@/lib/data";

export async function getAIInsights() {
  try {
    // In a real app, you would fetch the current user's transactions from the database
    const transactionsForAI = mockTransactions.map(({ id, userId, createdAt, ...rest }) => ({
        ...rest,
        userId: "user1",
        createdAt: new Date().toISOString(),
        date: new Date(rest.date).toISOString(),
    }));

    const input: GeneratePersonalizedInsightsInput = {
      transactions: transactionsForAI,
    };
    
    const result = await generatePersonalizedInsights(input);
    return result;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return { error: "Failed to generate AI insights. Please try again later." };
  }
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrainCircuit, Lightbulb, AlertTriangle, Loader2 } from "lucide-react";
import { getAIInsights } from "@/app/actions";
import type { GeneratePersonalizedInsightsOutput } from "@/ai/flows/generate-personalized-insights";

type Insight = GeneratePersonalizedInsightsOutput['insights'][0];

const severityIcon: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="h-4 w-4" />,
  tip: <Lightbulb className="h-4 w-4" />,
  prediction: <BrainCircuit className="h-4 w-4" />,
  info: <Lightbulb className="h-4 w-4" />,
};

export default function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights([]);
    try {
      const result = await getAIInsights();
      if ('error' in result) {
        setError(result.error);
      } else if (result && result.insights) {
        setInsights(result.insights);
      } else {
        setError("Received an unexpected response from the AI.");
      }
    } catch (e) {
      setError("An error occurred while generating insights.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Let our AI analyze your spending and provide personalized advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateInsights} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Generate Financial Insights"
          )}
        </Button>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <Alert key={index}>
              {severityIcon[insight.severity.toLowerCase()] || <Lightbulb className="h-4 w-4" />}
              <AlertTitle className="capitalize">{insight.type}: {insight.category}</AlertTitle>
              <AlertDescription>
                {insight.message}
                <br />
                <span className="font-semibold text-foreground">Recommendation: {insight.recommendation}</span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
        {insights.length === 0 && !loading && !error && (
            <div className="text-center text-muted-foreground py-6">
                <p>Click the button to generate your personalized financial insights.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
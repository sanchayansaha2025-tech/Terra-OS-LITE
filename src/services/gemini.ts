import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseDetectionResult, SoilHealthResult, ProfitPrediction } from "../types";

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  const ai = new GoogleGenAI({ apiKey });
  return ai;
}

export async function detectCropDisease(imageBase64: string): Promise<DiseaseDetectionResult> {
  const ai = getGeminiModel();
  const prompt = `Analyze this crop image. Identify disease (if any), severity (low/medium/high), and give simple treatment advice for a farmer. 
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
          treatment: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ["diseaseName", "severity", "treatment", "confidence"]
      }
    }
  });

  return JSON.parse(response.text) as DiseaseDetectionResult;
}

export async function analyzeSoil(location: string, answers: string): Promise<SoilHealthResult> {
  const ai = getGeminiModel();
  const prompt = `Based on the location "${location}" and these observations: "${answers}", 
  estimate soil type, nutrient status (Nitrogen, Phosphorus, Potassium as Low/Medium/High), health score (0-100), and give recommendations.
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          soilType: { type: Type.STRING },
          nutrientStatus: {
            type: Type.OBJECT,
            properties: {
              nitrogen: { type: Type.STRING },
              phosphorus: { type: Type.STRING },
              potassium: { type: Type.STRING }
            },
            required: ["nitrogen", "phosphorus", "potassium"]
          },
          healthScore: { type: Type.NUMBER },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["soilType", "nutrientStatus", "healthScore", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text) as SoilHealthResult;
}

export async function predictProfit(data: { crop: string, landSize: number, soilHealth: number, riskLevel: string }): Promise<ProfitPrediction> {
  const ai = getGeminiModel();
  const prompt = `As an agricultural economist, predict profit for:
  Crop: ${data.crop}
  Land Size: ${data.landSize} acres
  Soil Health Score: ${data.soilHealth}
  Current Risk Level: ${data.riskLevel}
  
  Provide estimated yield per acre, market price estimation, cost estimation, total profit, a risk warning, and suggestions.
  Return in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedYield: { type: Type.NUMBER },
          estimatedPrice: { type: Type.NUMBER },
          estimatedCost: { type: Type.NUMBER },
          totalProfit: { type: Type.NUMBER },
          riskWarning: { type: Type.STRING },
          suggestions: { type: Type.STRING }
        },
        required: ["estimatedYield", "estimatedPrice", "estimatedCost", "totalProfit", "riskWarning", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text) as ProfitPrediction;
}

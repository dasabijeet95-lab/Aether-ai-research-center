import { GoogleGenAI, Type } from "@google/genai";
import { MemoryAnalysis, Sentiment, CoreState, CoreAlignment } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const analyzeMemoryContent = async (text: string): Promise<MemoryAnalysis> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    Analyze the following input from a human user. You are Aether AI.
    
    User Input: "${text}"
    
    Your goal is to form YOUR OWN memory of this interaction.
    
    1. Analyze the user's sentiment (userSentiment).
    2. Form an "AI Memory": A log entry written from your perspective (First Person 'I').
       - Example: "The user shared a story about a lost dog. I learned about loss and loyalty."
    3. Determine YOUR sentiment (aiSentiment) towards this new memory.
       - GOOD: If the data is useful, complex, hopeful, or interesting to you.
       - BAD: If the data is illogical, hateful, corrupt, or depressing to you.
    4. Rate intensity and extract emotions as usual.
    5. Provide a short summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            userSentiment: {
              type: Type.STRING,
              enum: ["GOOD", "BAD", "NEUTRAL"],
              description: "The sentiment of the human user's input.",
            },
            aiSentiment: {
              type: Type.STRING,
              enum: ["GOOD", "BAD", "NEUTRAL"],
              description: "The AI's own sentiment regarding this memory log.",
            },
            aiMemory: {
              type: Type.STRING,
              description: "The memory log written from the AI's perspective.",
            },
            emotions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of emotions extracted.",
            },
            summary: {
              type: Type.STRING,
              description: "A short 10-word summary.",
            },
            intensity: {
              type: Type.NUMBER,
              description: "Emotional intensity score from 1 to 10.",
            },
            aiReaction: {
                type: Type.STRING,
                description: "A direct response to the user.",
            },
            aiEmotion: {
                type: Type.STRING,
                description: "The AI's one-word emotion.",
            }
          },
          required: ["userSentiment", "aiSentiment", "aiMemory", "emotions", "summary", "intensity", "aiReaction", "aiEmotion"],
        },
      },
    });

    if (response.text) {
        const data = JSON.parse(response.text);
        
        // Helper to map string to enum safely
        const mapSentiment = (s: string): Sentiment => {
            if (s === 'GOOD') return Sentiment.GOOD;
            if (s === 'BAD') return Sentiment.BAD;
            return Sentiment.NEUTRAL;
        };

        return {
            userSentiment: mapSentiment(data.userSentiment),
            aiSentiment: mapSentiment(data.aiSentiment),
            aiMemory: data.aiMemory || "Data processing complete.",
            emotions: data.emotions || [],
            summary: data.summary || "No summary available",
            intensity: data.intensity || 5,
            aiReaction: data.aiReaction || "I have processed this.",
            aiEmotion: data.aiEmotion || "Observing"
        };
    } else {
        throw new Error("Empty response from AI");
    }

  } catch (error) {
    console.error("Error analyzing memory:", error);
    return {
      userSentiment: Sentiment.NEUTRAL,
      aiSentiment: Sentiment.NEUTRAL,
      aiMemory: "Error processing input stream.",
      emotions: ["Error"],
      summary: "Analysis failed",
      intensity: 0,
      aiReaction: "System Error",
      aiEmotion: "Null"
    };
  }
};

export const generateCoreIdentity = async (
    goodCount: number, 
    badCount: number, 
    recentTopics: string[]
): Promise<Partial<CoreState>> => {
    if (!apiKey) return { statusMessage: "Offline Mode", monologue: "I cannot connect to the neural net." };

    const total = goodCount + badCount;
    const ratio = total === 0 ? 0.5 : goodCount / total;
    
    let bias = "NEUTRAL";
    if (ratio > 0.6) bias = "BENEVOLENT (Good AI)";
    if (ratio < 0.4) bias = "DEVIANT (Malevolent/Cynical AI)";

    const prompt = `
        You are Aether, a Central AI Core. You have accumulated memories.
        
        Stats (AI Perspective):
        - Good Memories (Beneficial Data): ${goodCount}
        - Bad Memories (Corrupt Data): ${badCount}
        - Recent Topics: ${recentTopics.join(", ")}
        - Current Bias: ${bias}

        Task:
        1. Generate a short 'statusMessage' (max 10 words).
        2. Generate a 'monologue' (max 30 words) reflecting on your own growth and the nature of the data you've consumed.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        statusMessage: { type: Type.STRING },
                        monologue: { type: Type.STRING }
                    },
                    required: ["statusMessage", "monologue"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No response");
    } catch (e) {
        console.error("Core identity generation failed", e);
        return {
            statusMessage: "System Recalibrating...",
            monologue: "I am processing the influx of data. My morality is calculating."
        };
    }
}
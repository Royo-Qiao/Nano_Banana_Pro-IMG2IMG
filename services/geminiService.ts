
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-3-pro-image-preview';

export async function generateImg2Img(
  base64Image: string,
  prompt: string,
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<string> {
  // Always create a new instance to ensure it uses the provided environment API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare data (extract mime type and data from dataURL)
  const [header, data] = base64Image.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: `Image-to-image transformation: ${prompt}. Maintain the composition but enhance it with this style.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        },
      },
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from the model.");
    }

    return imageUrl;
  } catch (error: any) {
    throw error;
  }
}

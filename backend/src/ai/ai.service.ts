import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateBuyerSummary(buyerData: any): Promise<{ summary: string; score: number; scoreReason: string }> {
    try {
      const prompt = `
        You are an expert Real Estate AI Assistant. Analyze the following buyer lead data and generate a JSON response.
        
        Buyer Data:
        ${JSON.stringify(buyerData, null, 2)}
        
        Generate a JSON object with the following structure exactly (no markdown formatting, no code blocks, just raw JSON):
        {
          "summary": "A 2-3 sentence professional summary of what the buyer is looking for, their budget, and readiness.",
          "score": <number between 0 and 100 representing their buying intent/quality. Base this on CIBIL, budget clarity, timeline, and loan requirements>,
          "scoreReason": "A 1 sentence explanation of why this score was given."
        }
      `;

      if (process.env.GEMINI_API_KEY) {
        const result = await this.model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Clean up potential markdown formatting (e.g. ```json ... ```)
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return {
          summary: parsed.summary,
          score: parsed.score,
          scoreReason: parsed.scoreReason,
        };
      } else {
        // Fallback simulated logic if no API key is provided
        this.logger.warn('No GEMINI_API_KEY found, using simulated AI response.');
        return {
          summary: `Customer is looking for a ${buyerData.propertyTypes || 'property'} in ${buyerData.preferredLocations || 'any location'} with a budget of ₹${buyerData.budgetMax || 'Unknown'}. ${buyerData.loanRequired ? 'Requires home loan.' : 'Cash buyer.'} Likely purchase within ${buyerData.timeline || 'Unknown'}.`,
          score: buyerData.budgetMax ? 85 : 50,
          scoreReason: buyerData.budgetMax ? 'High intent due to clear budget and requirements.' : 'Average intent due to missing budget data.',
        };
      }
    } catch (error) {
      this.logger.error('Failed to generate buyer summary', error);
      return {
        summary: 'Failed to generate AI summary. Please check the raw data.',
        score: 50,
        scoreReason: 'Failed to calculate score due to AI service error.',
      };
    }
  }

  async generateFollowUpMessage(buyerData: any, channel: 'WhatsApp' | 'Email'): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return `Hi ${buyerData.name}, thanks for your property inquiry! We are reviewing your requirements and will send you some matching properties soon.`;
      }
      
      const prompt = `Write a professional but friendly ${channel} follow-up message for a real estate lead named ${buyerData.name} who is looking for a ${buyerData.propertyTypes} in ${buyerData.preferredLocations}. Keep it concise and end with a call to action to schedule a call.`;
      const result = await this.model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
       this.logger.error('Failed to generate message', error);
       return `Hi ${buyerData.name}, thanks for reaching out!`;
    }
  }
}

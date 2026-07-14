import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import { generateBuyerSummaryPrompt, generateFollowUpMessagePrompt } from './prompts';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private geminiModel: any;
  private openai: OpenAI | null = null;

  constructor() {
    // Gemini Setup
    const geminiKey = process.env.GEMINI_API_KEY || 'dummy_key';
    this.genAI = new GoogleGenerativeAI(geminiKey);
    this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // OpenAI Setup
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async generateBuyerSummary(buyerData: any): Promise<{ summary: string; score: number; scoreReason: string }> {
    const prompt = generateBuyerSummaryPrompt(buyerData);

    try {
      if (this.openai) {
        this.logger.log('Using OpenAI for Buyer Summary');
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        const content = completion.choices[0].message.content;
        if (content) {
          return JSON.parse(content);
        }
      }

      if (process.env.GEMINI_API_KEY) {
        this.logger.log('Using Gemini for Buyer Summary');
        const result = await this.geminiModel.generateContent(prompt);
        const responseText = result.response.text().trim();
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      }

      this.logger.warn('No AI keys found, using simulated AI response.');
      return this.getSimulatedResponse(buyerData);
    } catch (error) {
      this.logger.error('Failed to generate buyer summary', error);
      // Fallback to Gemini if OpenAI failed, or simulate
      if (this.openai && process.env.GEMINI_API_KEY) {
         try {
           this.logger.log('OpenAI failed, falling back to Gemini');
           const result = await this.geminiModel.generateContent(prompt);
           const responseText = result.response.text().trim();
           const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
           return JSON.parse(jsonStr);
         } catch(e) {}
      }
      return this.getSimulatedResponse(buyerData);
    }
  }

  async generateFollowUpMessage(buyerData: any, channel: 'WhatsApp' | 'Email'): Promise<string> {
    const prompt = generateFollowUpMessagePrompt(buyerData, channel);
    
    try {
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        });
        return completion.choices[0].message.content?.trim() || '';
      }
      
      if (process.env.GEMINI_API_KEY) {
        const result = await this.geminiModel.generateContent(prompt);
        return result.response.text().trim();
      }
      
      return `Hi ${buyerData.name}, thanks for your property inquiry! We are reviewing your requirements and will send you some matching properties soon.`;
    } catch (error) {
       this.logger.error('Failed to generate message', error);
       return `Hi ${buyerData.name}, thanks for reaching out!`;
    }
  }

  private getSimulatedResponse(buyerData: any) {
    return {
      summary: `Customer is looking for a ${buyerData.propertyTypes || 'property'} in ${buyerData.preferredLocations || 'any location'} with a budget of ₹${buyerData.budgetMax || 'Unknown'}. ${buyerData.loanRequired ? 'Requires home loan.' : 'Cash buyer.'} Likely purchase within ${buyerData.timeline || 'Unknown'}.`,
      score: buyerData.budgetMax ? 85 : 50,
      scoreReason: buyerData.budgetMax ? 'High intent due to clear budget and requirements.' : 'Average intent due to missing budget data.',
    };
  }
}

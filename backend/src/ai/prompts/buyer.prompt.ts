export const generateBuyerSummaryPrompt = (buyerData: any) => {
  return `
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
};

export const generateFollowUpMessagePrompt = (buyerData: any, channel: 'WhatsApp' | 'Email') => {
  return `Write a professional but friendly ${channel} follow-up message for a real estate lead named ${buyerData.name} who is looking for a ${buyerData.propertyTypes || 'property'} in ${buyerData.preferredLocations || 'their preferred area'}. Keep it concise and end with a call to action to schedule a call.`;
};

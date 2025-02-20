import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Extract disease/condition keywords from natural language text
 */
export async function extractDiseaseKeywords(text: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a medical assistant. Extract disease names and medical conditions from user input. Return ONLY a JSON array of strings, nothing else. No markdown, no explanations.

User input: "${text}"

Return format example: ["diabetes", "heart disease"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();
    
    // Remove markdown code blocks if present
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    const keywords = JSON.parse(cleanContent);
    return Array.isArray(keywords) ? keywords : [];
  } catch (error) {
    console.error('Error extracting disease keywords:', error);
    return [];
  }
}

/**
 * Generate AI summary for clinical trial or publication
 */
export async function generateSummary(
  title: string,
  content: string,
  type: 'trial' | 'publication'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt =
      type === 'trial'
        ? `Summarize this clinical trial in 2-3 sentences for patients in simple, patient-friendly language:\n\nTitle: ${title}\n\nDescription: ${content}\n\nProvide only the summary, no additional text.`
        : `Summarize this research publication in 2-3 sentences for patients in simple, patient-friendly language:\n\nTitle: ${title}\n\nAbstract: ${content}\n\nProvide only the summary, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary || 'Summary unavailable.';
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary unavailable.';
  }
}

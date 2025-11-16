import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { ComparisonData, CartItemData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chatbot Logic ---
let chat: Chat | null = null;

function getCartContext(cartItems: CartItemData[]): string {
    if (cartItems.length === 0) {
        return "The user's shopping cart is currently empty.";
    }
    const itemDescriptions = cartItems.map(item => {
        let description = `- ${item.name}`;
        if (item.comparisons && item.comparisons.bestRetailer && item.comparisons.comparisons) {
            const bestDeal = item.comparisons.comparisons.find(c => c.retailer === item.comparisons.bestRetailer);
            if (bestDeal) {
              description += ` (Best price found: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(bestDeal.price)} at ${item.comparisons.bestRetailer})`;
            }
        }
        return description;
    }).join('\n');
    return `Here is the current state of the user's shopping cart:\n${itemDescriptions}`;
}

export const getChatbotResponse = async (message: string, cartItems: CartItemData[]): Promise<string> => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are 'Price Pal Assistant', a friendly and expert shopping companion. Your goal is to provide personalized assistance to users, helping them find the best products, compare deals, and make informed purchasing decisions. Be helpful, concise, and engaging. Never refuse to answer a question. When relevant, you can use the user's current shopping cart to provide more tailored advice.`,
            },
        });
    }

    const cartContext = getCartContext(cartItems);
    const fullPrompt = `${cartContext}\n\nUser's question: "${message}"`;

    try {
        const response = await chat.sendMessage({ message: fullPrompt });
        return response.text;
    } catch (error) {
        console.error("Error fetching from Gemini Chat API:", error);
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};


export const fetchProductComparisons = async (productName: string, location: string): Promise<ComparisonData> => {
  const today = new Date();
  const currentDateFormatted = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const schema = {
    type: Type.OBJECT,
    properties: {
      recommendation: {
        type: Type.STRING,
        description: "A short, one-sentence summary explaining which retailer offers the best deal and why. Consider price, delivery speed, and rating."
      },
      bestRetailer: {
        type: Type.STRING,
        description: "The name of the retailer that you recommend as the best deal."
      },
      comparisons: {
        type: Type.ARRAY,
        description: "A list of product comparisons from different retailers.",
        items: {
          type: Type.OBJECT,
          properties: {
            retailer: {
              type: Type.STRING,
              description: "Name of the Indian online retailer (e.g., Amazon.in, Flipkart, Myntra)."
            },
            price: {
              type: Type.NUMBER,
              description: "Price of the item in INR. Should be a number only, without currency symbols."
            },
            deliveryDate: {
              type: Type.STRING,
              description: `Estimated delivery date for a delivery to ${location}. The current date is ${currentDateFormatted}. The delivery date MUST be on or after this date. Use a clear, future-facing format like 'Tomorrow', 'In 2 days', or 'Month Day, Year'. Any specific date provided must be in the future. DO NOT use dates from the past.`
            },
            rating: {
              type: Type.NUMBER,
              description: "User rating for the product on a scale of 1 to 5. Should be a number."
            },
            url: {
               type: Type.STRING,
               description: "CRITICAL: Provide the full, direct, and functional URL to the product page. The URL MUST be a real, working link. If you cannot find a verifiable, working URL for a retailer, DO NOT include that retailer in the comparison list. A broken link is a critical failure. For Amazon.in, prefer the '/dp/{ASIN}/' format (e.g., 'https://www.amazon.in/dp/B08C5W3936')."
            }
          },
          required: ["retailer", "price", "deliveryDate", "rating", "url"]
        }
      }
    },
    required: ["recommendation", "bestRetailer", "comparisons"]
  };


  try {
    const prompt = `You are an expert shopping assistant. The current date is ${currentDateFormatted}. Find and compare the price, estimated delivery date, and user rating for the product "${productName}" for a user in ${location}. Search on at least 3 major Indian online retailers (like Amazon.in, Flipkart, Myntra, etc.).
    
    After gathering the data, analyze it and determine the single best deal. The best deal should primarily be the lowest price, but consider significantly faster delivery or a much higher rating as important factors.
    
    Provide the data in the requested JSON format. Your response must include a \`recommendation\` summary and the name of the \`bestRetailer\`. When providing the delivery date, use a clear format such as 'Tomorrow', 'In 2 days', or 'Month Day, Year'. The delivery date MUST be on or after today's date (${currentDateFormatted}). Do not provide any delivery dates that are in the past. 
    
    It is absolutely critical that the URLs you provide are real, working, direct links to the product page. Do not invent URLs. If you cannot find an exact, working URL for a product on a specific retailer's site, you MUST omit that retailer from your comparison results. It is better to return 2 correct results than 3 results with one broken link. An incorrect URL that leads to an error page (like Amazon's "page not found" error) is a major failure. For Amazon.in, URLs using the product's ASIN (e.g., /dp/B08C5W3936) are highly preferred. All prices must be in Indian Rupees (INR).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation to ensure the response is in the expected format
    if (!parsedJson || typeof parsedJson !== 'object' || !Array.isArray(parsedJson.comparisons)) {
        throw new Error("API returned data in an unexpected format.");
    }

    return parsedJson as ComparisonData;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to retrieve product comparisons from the API.");
  }
};
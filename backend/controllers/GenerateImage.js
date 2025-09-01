import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";

dotenv.config();

// Setup open ai api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    console.log("✅ Received Prompt:", prompt);

    if (!prompt || prompt.length < 10) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Prompt is too short or invalid.",
      });
    }    

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    const generatedImage = response.data.data[0].url;
    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    console.error("❌ OpenAI Error Details:", error);
    next(
      createError(
        error.status,
        error?.response?.data?.error.message || error.message
      )
    );
  }
};
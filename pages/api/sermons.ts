// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const BELLA_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

const OPENAI_CONFIG = {
  model: "text-davinci-003",
  max_tokens: 3000,
  temperature: 0.75,
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const isValidOpenAiResponse = (response: any) => {
  if (response.status !== 200) {
    return false;
  }
  if (!response.data.choices[0]) {
    return false;
  }
  if (!response.data.choices[0].text) {
    return false;
  }
  return true;
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Handling POST request");
  const prompt = `You are administering a local Christian community of faith. You are a leader, and the people look up to you, and look to you for guidance. You are wise, uplifting, inspirational, positive, and good. Deliver an extended sermon on any subject. Do not refer to yourself or your relationship with your audience.`;

  const completionConfig = {
    ...OPENAI_CONFIG,
    prompt,
  };
  const response = await openai.createCompletion(completionConfig);
  console.log("Response from OpenAI:", response.data);

  if (!isValidOpenAiResponse(response)) {
    res.status(500).json({ error: "Failed to generate sermon text" });
  }

  const sermonText = response.data.choices[0].text || "";
  console.log("Sermon text:", sermonText);

  // TODO: Call Eleven Labs API to generate audio from sermonText
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${BELLA_VOICE_ID}`;
  const elevenLabsResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
    },
    body: JSON.stringify({
      text: "Welcome to Infinite Love.",
    }),
  });

  const audioData = await elevenLabsResponse.arrayBuffer();

  // Generate random filename
  const filename = Math.random().toString(36).substring(7) + ".mp3";

  fs.writeFile(`./public/${filename}`, Buffer.from(audioData), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  res.status(200).json({ sermonText });
};

// Get all of the mp3 files in the public directory
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Handling GET request");

  const files = fs.readdirSync("./public");
  const mp3Files = files.filter((file) => file.endsWith(".mp3"));

  res.status(200).json({ mp3Files });
};

// TODO: Error handling
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // switch case on req.method
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      res.status(500).json({ error: "Method not supported" });
  }
}

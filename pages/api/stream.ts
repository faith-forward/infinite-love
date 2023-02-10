import fs from "fs";
import Multistream from "multistream";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Handling GET request");
  res.setHeader("Content-Type", "audio/mpeg");

  // Get all mp3 files from public/audio
  const files = fs.readdirSync(path.join(process.cwd(), "public", "audio"));
  const mp3Files = files.filter((file) => file.endsWith(".mp3"));

  let streams: any[] = []

  mp3Files.forEach((file) => {
    streams.push(fs.createReadStream(path.join(process.cwd(), "public", "audio", file)));
  })

  // Pipe the multistream to the response
  new Multistream(streams).pipe(res);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    default:
      return res.status(405).end();
  }
}

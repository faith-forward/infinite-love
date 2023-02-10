"use client";

import React, { useState, useEffect } from "react";

// TODO:
// - Manage audios with S3
// - Better naming
// - Better UI
// - Stream endless audio

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<any[]>([]);

  console.log("audioFiles:", audioFiles);

  // TODO: Hook
  useEffect(() => {
    fetch("/api/sermons")
      .then((res) => res.json())
      .then((data) => setAudioFiles(data.mp3Files))
      .catch((err) => console.error(err));
  }, []);

  // TODO: Hook
  const generateSermon = async () => {
    console.log("Generating sermon...");
    const response = await fetch("/api/sermons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "Hello world" }),
    });
    const data = await response.json();
    console.log("Generated sermon:", data);
  };

  // TODO: Style
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-white text-4xl font-bold mb-10">Infinite Love</h1>

      <div className="mb-10">
        <p className="text-white text-xl font-bold">Stream</p>

        <audio className="w-64 my-5 rounded-lg shadow-md" controls>
          <source src="/api/stream" type="audio/mpeg" />
        </audio>
      </div>

      {audioFiles.map((file) => (
        <div key={file} className="mb-10">
          <p className="text-white text-xl font-bold">{file}</p>

          <audio className="w-64 my-5 rounded-lg shadow-md" controls>
            <source src={`/audio/${file}`} type="audio/mpeg" />
          </audio>
        </div>
      ))}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
        onClick={generateSermon}
      >
        Generate
      </button>
    </div>
  );
}

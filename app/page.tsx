"use client";

// TODO:
// Create Firebase project, move bella-on-love there, pull from Firebase for audios
// Add a button to generate a fresh audio (GPT + Eleven)

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Infinite Love</h1>
      <AudioPlayer />
    </div>
  );
}

const AudioPlayer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <audio controls>
        <source src="bella-on-love.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

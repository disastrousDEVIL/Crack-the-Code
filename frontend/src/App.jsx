import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE || '/api')
  : (import.meta.env.VITE_API_BASE || '');

function App() {
const [pastGuesses,setPastGuesses]=useState([])
const [guess,setGuess]=useState("")
const [result,setResult]=useState("")
const [gameStarted,setGameStarted]=useState(false)
const [error,setError]=useState("")
const [startAnim, setStartAnim] = useState(false)
const [attemptLimit, setAttemptLimit] = useState(10) // 10,15,20 or 0 for unlimited
const [lastPingOk, setLastPingOk] = useState(false)

useEffect(() => {
  const ping = async () => {
    try {
      await fetch(`${API_BASE}/`, { method: "GET", cache: "no-store" });
      setLastPingOk(true);
      console.debug("Keep-alive ping sent");
    } catch (e) {
      setLastPingOk(false);
      console.debug("Keep-alive ping failed:", e);
    }
  };

  ping();
  const id = setInterval(ping, 120000);
  return () => clearInterval(id);
}, []);

const startGame=async ()=>{
 try {
   await axios.post(`${API_BASE}/start`, null, { params: { limit: attemptLimit } })
   setGameStarted(true);
   setResult("");
   setPastGuesses([]);
   setError("");
 } catch (error) {
   setError("Failed to start game. Please try again.");
   console.error("Start game error:", error);
 }
};

const makeGuess=async ()=>{
 try {
   // quick frontend validation
   if (guess.length !== 4) {
     setError("Guess must be 4 digits");
     setResult("");
     return;
   }
   if (new Set(guess).size !== 4) {
     setError("Digits must be unique (no repeats)");
     setResult("");
     return;
   }
  const res=await axios.post(`${API_BASE}/guess`,null,{params:{guess}})
   
   // Check if there's an error in the response
   if (res.data.error) {
     setError(res.data.error);
     setResult("");
   } else {
     setError("");
     setResult(res.data);
   }
   
   // Fetch updated past guesses
  const pg=await axios.get(`${API_BASE}/past_guesses`)
   setPastGuesses(pg.data.past_guesses)
 } catch (error) {
   setError("Failed to submit guess. Please try again.");
   setResult("");
   console.error("Make guess error:", error);
 }
};

return (
<div className="min-h-screen starfield text-green-100 flex flex-col" data-theme="dark">
  <div className="navbar bg-[#020202] text-[#16DB65] border-b border-[#0A9548] shadow-[0_10px_30px_-10px_rgba(10,149,72,0.35)] relative">
    <div className="w-full flex justify-center">
      <h1 className="font-orbitron text-2xl md:text-4xl font-extrabold tracking-widest text-center">Which Number Am I?</h1>
    </div>
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${lastPingOk ? 'bg-green-500' : 'bg-red-500'}`}
        title={lastPingOk ? "Connected" : "Disconnected"}
      ></span>
      <span className="text-sm">{lastPingOk ? "Connected" : "Offline"}</span>
    </div>
  </div>
  
  <div className="container mx-auto p-6 flex-1 flex flex-col">
    {!gameStarted && (
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-[#0A9548] bg-[#0D2818]/60 shadow shadow-[#0A9548]/20 overflow-hidden">
          <span className="px-3 py-2 text-[#16DB65]/80 text-sm font-space">Attempts</span>
          {[10,15,20,0].map((val)=> (
            <button
              key={val}
              className={`px-4 py-2 text-sm md:text-base transition-colors ${attemptLimit===val ? 'bg-[#16DB65] text-black' : 'text-[#16DB65]'}`}
              onClick={()=>setAttemptLimit(val)}
            >
              {val===0 ? '∞' : val}
            </button>
          ))}
        </div>
      </div>
    )}
    {!gameStarted && (
      <div className="flex-1 w-full grid place-items-center">
        <button
          className={`btn-wireframe transition transform-gpu duration-500 -translate-y-8 ${startAnim ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}
          onClick={() => {
            setStartAnim(true);
            setTimeout(() => {
              startGame();
              setStartAnim(false);
            }, 500);
          }}
        >
          <span className="tracking-widest select-none">START</span>
        </button>
      </div>
    )}
  
  {error && (
    <div className="mt-6 mx-auto w-full max-w-5xl rounded-xl bg-[#04471C]/80 border border-[#16DB65] text-[#16DB65] px-6 py-4 text-lg md:text-xl shadow-lg shadow-[#0A9548]/20">
      <span className="font-bold mr-2">Error:</span>{error}
    </div>
  )}
  {gameStarted && !result?.result && (
    <div className="mt-10 text-center">
      <div className="panel-attempts mx-auto w-full max-w-5xl text-4xl md:text-6xl font-extrabold tracking-wide mb-8 font-space attempts-text">
        Attempts remaining: {attemptLimit === 0 ? '∞' : Math.max((attemptLimit - pastGuesses.length), 0)}
      </div>
      <div className="flex flex-col items-center gap-6">
        <input 
          type="text" 
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          className="input w-full max-w-2xl h-20 text-3xl text-center bg-[#020202]/60 text-green-100 placeholder:text-green-200/40 border border-[#16DB65]/30 focus:border-[#16DB65] focus:outline-none focus:ring-2 focus:ring-[#16DB65]/40 font-space"
          value={guess} 
          onChange={(e)=>{
            const next = e.target.value.replace(/\D/g, '').slice(0,4);
            setGuess(next);
            if(error) setError(""); // Clear error when user starts typing
          }} 
          placeholder="Enter your 4 unique digits" 
        />
        <button className="btn-neo text-2xl" onClick={makeGuess}>Submit Guess</button>
      </div>
    </div>
  )}
  
  {result?.result && (
    <div className="mt-5 flex justify-center">
      <button 
        className="btn btn-outline bg-transparent text-[#16DB65] border-[#16DB65] hover:bg-[#16DB65] hover:text-black"
        onClick={() => {
          setGameStarted(false);
          setResult("");
          setPastGuesses([]);
          setError("");
          setGuess("");
        }}
      >
        New Game
      </button>
    </div>
  )}
  {result && (
    <div className="mt-8 mx-auto w-full max-w-5xl">
      {result.result ? (
        <div className={`rounded-lg px-6 py-5 ${result.result.includes("Game Over") ? "bg-[#440000]/70 border border-red-500 text-red-300" : "bg-[#04471C]/80 border border-[#16DB65] text-[#16DB65]"} text-center select-none animate-win-pop`}>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide select-none">
            {result.result.includes("Game Over") ? "😞 " : "🎉 "}{result.result}{result.result.includes("Game Over") ? " 😞" : " 🎉"}
          </h2>
          {result.secret && (
            <div className="mt-4 rounded-md bg-[#0D2818]/70 border border-[#0A9548] px-4 py-3 text-green-100">
              <div className="text-2xl md:text-3xl font-bold select-none">
                The answer was: <span className="text-4xl md:text-5xl text-[#16DB65]">{result.secret}</span>
              </div>
            </div>
          )}
          {/* Confetti burst overlay on win (same page) */}
          {!result.result.includes("Game Over") && (
            <div className="confetti-overlay">
              {Array.from({ length: 36 }).map((_, idx) => {
                const colors = ["#16DB65", "#0A9548", "#04471C", "#A7F3D0"];
                const color = colors[idx % colors.length];
                const dx = `${(Math.random() * 80 - 40).toFixed(1)}vw`;
                const dy = `${(Math.random() * -45 - 15).toFixed(1)}vh`;
                const rot = `${Math.floor(Math.random() * 540 - 270)}deg`;
                const delay = `${Math.floor(Math.random() * 100)}ms`;
                const size = `${Math.floor(Math.random() * 6) + 6}px`;
                return (
                  <span
                    key={idx}
                    className="confetti-piece"
                    style={{
                      "--c": color,
                      "--dx": dx,
                      "--dy": dy,
                      "--rot": rot,
                      "--delay": delay,
                      "--size": size,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-[#0D2818]/80 border border-[#0A9548] px-6 py-4 text-green-100 shadow-lg shadow-[#0A9548]/20 select-none">
          <div className="flex justify-center gap-10">
            <span className="text-[#16DB65] font-bold text-xl">
              ✓ Digits Correct: {result.digits_correct}
            </span>
            <span className="text-[#0A9548] font-bold text-xl">
              🎯 Positions Correct: {result.positions_correct}
            </span>
          </div>
        </div>
      )}
    </div>
  )}
  {pastGuesses.length > 0 && (
    <div className="mt-10 mx-auto w-full max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-5 text-[#16DB65]">Past Guesses</h2>
      <div className="space-y-4">
        {pastGuesses.map((item, index) => (
          <div key={index} className="rounded-lg bg-[#0D2818]/60 border border-[#04471C] border-l-4 border-l-[#0A9548] shadow shadow-black/20">
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {item.guess}
                </div>
                <div className="flex gap-8 text-lg">
                  <span className="text-[#16DB65] font-semibold">
                    ✓ Digits Correct: {item.digits_correct}
                  </span>
                  <span className="text-[#0A9548] font-semibold">
                    🎯 Positions Correct: {item.positions_correct}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
  </div>
  </div>
)};
export default App;

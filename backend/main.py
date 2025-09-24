from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
# from pydantic import BaseModel
import random
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

app=FastAPI()
secret=0
attempt_limit=10
past_guesses={} # list of past guesses
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
def generate_secret():
    digits=list("0123456789")
    random.shuffle(digits)
    if digits[0]=="0":
        digits[0],digits[1]=digits[1],digits[0]
    return "".join(digits[:4])

@app.post("/start")
async def start_game(limit: int | None = None, unlimited: bool = False):
    """Start a new game with a configurable attempt limit.
    - limit: 10, 15, 20, or 0 for unlimited. If None, uses legacy 'unlimited' flag.
    """
    global secret, past_guesses, attempt_limit
    secret = generate_secret()
    past_guesses.clear()  # reset past guesses on every restart
    if limit is not None:
        attempt_limit = 0 if limit == 0 else int(limit)
    else:
        attempt_limit = 0 if unlimited else 10
    # print(secret)
    # return {"secret": secret, "attempt_limit": attempt_limit}

@app.post("/guess")
async def guess_number(guess:str):
    global secret, past_guesses, attempt_limit
    if secret==0:
        return {"error":"Game not started"}
    if len(guess)!=4:
        return {"error":"Guess must be 4 digits"}
    if not guess.isdigit():
        return {"error":"Guess must be a number"}
    # all digits must be unique
    if len(set(guess)) != 4:
        return {"error":"Digits must be unique (no repeats)"}
    if guess in past_guesses:
        return {"error":"Guess already made"}
    if guess==secret:
        past_guesses.clear()  # Clear all past guesses when player wins
        return {"result":"You win"}

    
    digits_correct = sum(min(secret.count(d), guess.count(d)) for d in set(guess))
    positions_correct = sum(s == g for s, g in zip(secret, guess))
    past_guesses[guess]={"digits_correct":digits_correct,"positions_correct":positions_correct}
    
    # Enforce attempt limit only if enabled (>0)
    if attempt_limit and len(past_guesses) >= attempt_limit:
        return {
            "result": f"Game Over - You've used all {attempt_limit} attempts!",
            "secret": secret,
            "Guess": guess,
            "digits_correct": digits_correct,
            "positions_correct": positions_correct
        }
    
    return {"Guess":guess,"digits_correct":digits_correct,"positions_correct":positions_correct}

@app.get("/past_guesses")
async def get_past_guesses():
    global past_guesses
    # Convert dictionary to array format for easier frontend handling
    past_guesses_array = [{"guess": guess, "digits_correct": data["digits_correct"], "positions_correct": data["positions_correct"]} for guess, data in past_guesses.items()]
    return {"past_guesses": past_guesses_array}



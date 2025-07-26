from fastapi import FastAPI
from users import router as user_router
from pydantic import BaseModel
from typing import List
from datetime import datetime
import random

app = FastAPI()

# Mount user auth routes early
app.include_router(user_router)

# Sample 100 common words (for typing prompt)
COMMON_WORDS = [
    "the", "of", "and", "to", "a", "in", "is", "you", "that", "it",
    "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
    "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
    "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
    "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
    "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
    "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
    "two", "more", "write", "go", "see", "number", "way", "could", "people", "my"
]

# In-memory test results (temporary)
typing_test_results = []

class TypingTestResult(BaseModel):
    prompt: List[str]
    wpm: float
    raw_wpm: float
    accuracy: float
    timestamp: str  # frontend timestamp (ISO)

@app.post("/api/typing-tests")
def save_test_result(result: TypingTestResult):
    typing_test_results.append(result)
    return {"message": "Result saved successfully", "data": result}

@app.get("/api/typing-tests")
def get_all_results():
    return {"results": typing_test_results}

@app.get("/api/prompt")
def get_prompt():
    num_words = random.randint(20, 30)
    prompt_words = random.sample(COMMON_WORDS, num_words)
    return {"prompt": prompt_words}

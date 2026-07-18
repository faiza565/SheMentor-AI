"""
MODULE 5: AI Career Assistant

Thin wrapper around an LLM provider. Uses the OpenAI SDK here to match the stack
in the architecture doc, but the prompt logic is provider-agnostic — swap the
client call for Anthropic's /v1/messages if that's the preferred provider.
"""

from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
import requests

import os
from dotenv import load_dotenv

load_dotenv()

print("API KEY EXISTS:", os.getenv("OPENAI_API_KEY") is not None)

from .. import models, schemas
from ..auth_utils import get_current_user

router = APIRouter(prefix="/chat", tags=["ai-assistant"])

SYSTEM_PROMPT = (
    "You are the SheMentor AI career assistant, embedded in a mentorship platform for women. "
    "Be warm, concise, and practical. When asked for a roadmap, respond with short numbered "
    "monthly or weekly milestones. When asked to review a resume, give one clear strength, one "
    "clear gap, and one concrete next step. Keep replies under 200 words unless asked for more detail."
)


def call_openai(messages):
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured"
        )

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o-mini",
            "messages": messages,
            "max_tokens": 400
        }
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=response.text
        )

    return response.json()["choices"][0]["message"]["content"]


@router.post("/message", response_model=schemas.ChatResponse)
def chat_message(payload: schemas.ChatRequest):
    try:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if payload.history:
            messages.extend(payload.history)

        messages.append({
            "role": "user",
            "content": payload.message
        })

        reply = call_openai(messages)

        return schemas.ChatResponse(reply=reply)

    except Exception as e:
        print("OPENAI ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roadmap", response_model=schemas.ChatResponse)
def generate_roadmap(payload: schemas.RoadmapRequest):
    client = get_client()
    prompt = (
        f"Create a step-by-step learning roadmap for someone at {payload.experience_level} level "
        f"who wants to become a {payload.goal}. Format as numbered monthly milestones, max 4 months."
    )
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        max_tokens=400,
    )
    reply = completion.choices[0].message.content
    return schemas.ChatResponse(reply=reply)

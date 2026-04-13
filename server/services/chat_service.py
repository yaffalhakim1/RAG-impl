import google.generativeai as genai
from typing import List, AsyncGenerator
import json
from .vector_service import vector_service

class ChatService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("models/gemini-flash-latest")

    async def get_chat_response(self, query: str, context_chunks: List[str]) -> AsyncGenerator[str, None]:
        """Generate response with retrieved context using Gemini 1.5 Flash"""
        
        context_text = "\n\n---\n\n".join(context_chunks)
        
        prompt = f"""
You are a Research Assistant for Archive-RS. Answer the user's question accurately using ONLY the provided document context.
If the answer is not in the context, say "I don't have enough information in your archive to answer that."

Context from Documents:
{context_text}

Question: {query}
"""

        # Generate stream
        response = await self.model.generate_content_async(prompt, stream=True)
        
        async for chunk in response:
            if chunk.text:
                yield chunk.text

# Instance initialized in main.py

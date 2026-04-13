from markitdown import MarkItDown
from fastembed import TextEmbedding
import os
from typing import List
import asyncio

class IngestionService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.md_converter = MarkItDown()
        # FastEmbed runs locally via ONNX Runtime without internet limits!
        self.embedding_model = TextEmbedding()

    async def extract_markdown(self, file_path: str) -> str:
        """Use MarkItDown to convert any supported file to Markdown string"""
        # MarkItDown is synchronous, so we run it in a thread pool executor
        result = await asyncio.to_thread(self.md_converter.convert, file_path)
        return result.text_content

    def chunk_markdown(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Simple recursive-style chunking for Markdown"""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            if end >= len(text):
                break
            start += chunk_size - overlap
        return chunks

    async def get_embeddings(self, chunks: List[str]) -> List[List[float]]:
        """Generate local embeddings using FastEmbed's highly optimized CPU models"""
        if not chunks:
            return []
            
        # FastEmbed returns a generator of numpy arrays. List comprehension converts them to Python floats.
        def _embed():
            return [list(vec) for vec in self.embedding_model.embed(chunks)]
            
        # Run in thread so CPU-bound embedding doesn't block FastAPI
        embeddings = await asyncio.to_thread(_embed)
        return embeddings

# The instance will be initialized in main.py with the API key from env

import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import shutil
import tempfile
import asyncio

from services.ingestion_service import IngestionService
from services.vector_service import vector_service
from services.chat_service import ChatService

# 1. Environment and Config
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY must be set in .env")

# 2. Services Initialization
ingestion_service = IngestionService(API_KEY)
chat_service = ChatService(API_KEY)

# 3. FastAPI Setup
app = FastAPI(title="Archive-RS API (Python)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Schemas
class ChatRequest(BaseModel):
    query: str

# 5. Routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "engine": "Python/FastAPI", "v": "0.2.0"}

@app.post("/api/ingest")
async def ingest_file(file: UploadFile = File(...)):
    """Convert any file to Markdown, Chunk it, and Store it."""
    
    # Create temp file for conversion
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # a. Extract Markdown
        md_text = await ingestion_service.extract_markdown(tmp_path)
        
        # b. Chunking
        chunks = ingestion_service.chunk_markdown(md_text)
        
        # c. Embeddings
        embeddings = await ingestion_service.get_embeddings(chunks)
        
        # d. LanceDB storage
        await vector_service.add_chunks(chunks, embeddings, file.filename)
        
        return {"success": True, "chunks_indexed": len(chunks)}
    except Exception as e:
        print(f"Error ingesting file: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/api/chat")
async def chat_interaction(request: ChatRequest):
    """Semantic Search + Gemini Logic"""
    
    try:
        # a. Get embedding for the query
        query_embedding_list = await ingestion_service.get_embeddings([request.query])
        query_embedding = query_embedding_list[0]
        
        # b. Search similar chunks
        results = await vector_service.search_similar(query_embedding)
        context_chunks = [r["text"] for r in results]
        
        # c. Generate response stream
        async def stream_generator():
            async for text in chat_service.get_chat_response(request.query, context_chunks):
                yield text
                
        return StreamingResponse(stream_generator(), media_type="text/plain")
        
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

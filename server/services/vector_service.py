import lancedb
import os
import pyarrow as pa
from typing import List, Dict, Any, Optional

class VectorService:
    def __init__(self, db_path: str = "./data/archive.lance"):
        self.db_path = db_path
        self.db = None
        self.table_name = "chunks"
        self.dim = 384  # FastEmbed default dimension size (BAAI/bge-small-en-v1.5)

    async def connect(self):
        """Lazy connection to LanceDB"""
        if self.db is None:
            # Ensure data directory exists
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            self.db = await lancedb.connect_async(self.db_path)
        return self.db

    def get_schema(self) -> pa.Schema:
        """Define strict schema: id, text, vector (fixed size), filename"""
        return pa.schema([
            pa.field("id", pa.int32()),
            pa.field("text", pa.string()),
            pa.field("vector", pa.list_(pa.float32(), self.dim)),
            pa.field("filename", pa.string()),
        ])

    async def add_chunks(self, chunks: List[str], vectors: List[List[float]], filename: str):
        """Add a batch of chunks to the table with schema enforcement"""
        db = await self.connect()
        
        data = []
        for i, (text, vector) in enumerate(zip(chunks, vectors)):
            data.append({
                "id": i,
                "text": text,
                "vector": vector,
                "filename": filename
            })

        if self.table_name in await db.table_names():
            table = await db.open_table(self.table_name)
            await table.add(data)
        else:
            await db.create_table(
                self.table_name, 
                data=data, 
                schema=self.get_schema()
            )

    async def search_similar(self, query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """Perform similarity search"""
        db = await self.connect()
        if self.table_name not in await db.table_names():
            return []
        
        table = await db.open_table(self.table_name)
        # LanceDB Python SDK async search requires awaiting the search builder FIRST
        query = await table.search(query_vector)
        results = await query.limit(limit).to_list()
        return results

# Singleton instance
vector_service = VectorService()

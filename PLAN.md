This project overview is designed specifically for your **2GB VPS** and your background as a **Frontend Dev** learning **Rust**.

We are calling this project **"Archive-RS"** (a nod to Rust and your personal archive).

---

# 📑 Project Overview: Archive-RS

**A Private, High-Performance NotebookLM Clone**

## 🎯 Objectives

- **Deep Learning:** Master Rust (Axum/Tokio) and RAG (Retrieval-Augmented Generation).
- **Efficiency:** Run a full AI research suite on a low-spec 2GB RAM VPS.
- **Utility:** Create a searchable "second brain" for your Rust notes, wedding planning, and dev docs.

---

## 🛠️ The Tech Stack (The "Lean" Stack)

| Layer             | Technology               | Why?                                                                                |
| :---------------- | :----------------------- | :---------------------------------------------------------------------------------- |
| **Frontend**      | **React VITE**           | Your 2 YOE strength. Excellent for SEO/UI.                                          |
| **Backend**       | **Rust (Axum + Tokio)**  | Extremely low RAM footprint; teaches you memory safety.                             |
| **Orchestration** | **Docker Compose**       | Easy deployment to your VPS with memory limits.                                     |
| **Vector DB**     | **LanceDB**              | **Serverless/Embedded.** It stores data as files; no background process eating RAM. |
| **AI Brain**      | **Gemini 1.5 Flash API** | Massive 1M+ token context. Free tier available.                                     |

---

## 🏗️ System Architecture

1.  **Ingestion:** User uploads a PDF/Markdown $\rightarrow$ Rust extracts text $\rightarrow$ Gemini Embeddings API converts text to vectors $\rightarrow$ LanceDB saves vectors.
2.  **Retrieval:** User asks a question $\rightarrow$ Rust searches LanceDB for top 5 matches $\rightarrow$ Matches are injected into a prompt.
3.  **Generation:** Gemini API processes the prompt $\rightarrow$ Streams the answer back to Next.js.

---

## 📅 4-Week Development Roadmap

### **Week 1: The Foundation (Infrastructure)**

- Set up **React** with a basic chat UI.
- Initialize **Axum** (Rust) project with a `/health` endpoint.
- **VPS Goal:** Deploy the "Hello World" stack via Docker to ensure your 2GB RAM can handle the baseline.

### **Week 2: The Memory (Vector Storage)**

- Integrate **LanceDB** into the Rust backend.
- Create a script to "Chunk" text (splitting long files into 1000-character pieces).
- Connect the **Gemini Embedding API** to turn those chunks into numbers (vectors).

### **Week 3: The Logic (RAG Pipeline)**

- Implement "Similarity Search": When a user types, find the most relevant document chunks.
- Connect **Gemini 1.5 Flash** for the final chat response.
- **Feature:** Ensure the AI cites which "Chunk ID" it used (mimicking NotebookLM).

### **Week 4: The Polish (Dev Experience)**

- **Syntax Highlighting:** Use a library like `shiki` or `prism` so your Rust code blocks look professional.
- **PDF Viewer:** Add a side-by-side view where the PDF stays on the left and chat stays on the right.
- **Security:** Add simple JWT/Auth so only you can access your private data.

---

## ⚠️ VPS Resource Management (Crucial for 2GB RAM)

Since your VPS is small, follow these **"Golden Rules"**:

1.  **Binary Stripping:** Rust binaries are huge. Use `cargo build --release` and then run `strip target/release/archive-rs` to reduce the file size from ~100MB to ~10MB.
2.  **Memory Limits:** In your `docker-compose.yml`, set a hard limit:
    ```yaml
    deploy:
      resources:
        limits:
          memory: 512M
    ```
3.  **Swap File:** Ensure you have a **2GB or 4GB Swap File** on your VPS. Rust compilation is memory-intensive; without Swap, `cargo build` will crash your server.
4.  **Offload LLM:** Never try to run a local model (like Llama 3) on this VPS. Always use the **Gemini API**—it's essentially "free" compute for your small server.

---

## 🚀 Why this wins for your Career

- It proves you can handle **Rust** in a production backend.
- It shows you understand **AI Infrastructure (RAG)**, not just calling an API.
- It demonstrates **Resource Optimization**—running a modern AI app on "cheap" hardware.

**Next Step:** Would you like the initial `Cargo.toml` and a basic Axum "File Upload" boilerplate in Rust to start Week 1?

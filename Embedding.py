# ============================================
# 🧠 Text + Image Embedding Generator
# Uses CLIP (local) + OpenAI (optional)
# ============================================

from sentence_transformers import SentenceTransformer
from PIL import Image
import numpy as np
import torch

# OPTIONAL: uncomment if you want to combine with OpenAI text embeddings
# from openai import OpenAI
# import os
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# -------------------------------
# 1️⃣ Load CLIP model
# -------------------------------
print("Loading CLIP model...")
clip_model = SentenceTransformer('clip-ViT-B-32') # 512D output

# -------------------------------
# 2️⃣ Input text + image path
# -------------------------------
text_input = "Broken glass near the LRT platform entrance."
image_path = "sample_image.jpg" # make sure the image exists locally

# -------------------------------
# 3️⃣ Compute CLIP embeddings
# -------------------------------
print("Generating embeddings...")

# Encode text and image into the same embedding space
text_emb = clip_model.encode([text_input], convert_to_numpy=True, normalize_embeddings=True)
image = Image.open(image_path)
image_emb = clip_model.encode([image], convert_to_numpy=True, normalize_embeddings=True)

# -------------------------------
# 4️⃣ Combine embeddings
# -------------------------------
# Simple approach: average them (you can also weight them)
combined_emb = np.mean([text_emb[0], image_emb[0]], axis=0)

# -------------------------------
# 5️⃣ Print embedding details
# -------------------------------
print("\n=== Embedding Info ===")
print(f"Text Embedding Shape: {text_emb.shape}")
print(f"Image Embedding Shape: {image_emb.shape}")
print(f"Combined Embedding Shape: {combined_emb.shape}")
print(f"First 10 values: {combined_emb[:10]}")

# -------------------------------
# 6️⃣ (Optional) Use OpenAI text embedding and merge
# -------------------------------
"""
openai_emb = client.embeddings.create(
model="text-embedding-3-large",
input=text_input
).data[0].embedding

# Combine OpenAI and CLIP embeddings for multimodal richness
openai_emb = np.array(openai_emb)
combined_hybrid = np.concatenate((combined_emb, openai_emb)) # hybrid vector

print(f"\nHybrid Embedding Shape: {combined_hybrid.shape}")
"""

# -------------------------------
# ✅ Now you can store `combined_emb`
# in a vector DB (pgvector, Pinecone, etc.)
# -------------------------------
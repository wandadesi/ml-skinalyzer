import base64
import io
import pickle
import pandas as pd
import numpy as np
from PIL import Image
from ultralytics import YOLO
from sklearn.metrics.pairwise import cosine_similarity


# Load YOLO model (pastikan path dan file model Anda benar)
model = YOLO("app/model/face_detect.pt")


def detect_face_cleanliness(base64_image):
    # Decode base64 ke format gambar
    image = Image.open(io.BytesIO(base64.b64decode(base64_image))).convert("RGB")

    # Jalankan prediksi
    results = model.predict(image, conf=0.25)  # Anda bisa atur confidence threshold

    output = []
    for box in results[0].boxes:
        label_id = int(box.cls[0].item())
        label = model.names[label_id]
        confidence = round(float(box.conf[0].item()), 2)
        xyxy = box.xyxy[0].tolist()  # [xmin, ymin, xmax, ymax]

        output.append({
            "label": label,
            "confidence": confidence,
            "bbox": xyxy,
        })

    return {"num_detections": len(output), "detections": output}


import pickle
from sentence_transformers import util

# Load model and data
with open('app/model/df_with_mpnet_embeddings.pkl', 'rb') as f:
    df = pickle.load(f)

with open('app/model/mpnet_model.pkl', 'rb') as f:
    mpnet_model = pickle.load(f)

def retrieve_with_mpnet(query, top_n=10, min_score=0.1):
    if not query:
        return []

    # Encode query
    query_embedding = mpnet_model.encode(query, convert_to_tensor=True)

    # Hitung similarity
    similarities = [util.cos_sim(query_embedding, emb).item() for emb in df['MPNet_Embedding']]

    # Salin df dulu biar gak ubah df asli
    df_temp = df.copy()
    df_temp['Similarity_Score'] = similarities

    # Filter skor minimum dan ambil top_n
    top_results = df_temp[df_temp['Similarity_Score'] > min_score]
    top_results = top_results.sort_values('Similarity_Score', ascending=False).head(top_n)
    # print(df[['name', 'description']].head(1))
    # print(type(df['MPNet_Embedding'].iloc[0]))
    # print(len(df['MPNet_Embedding'].iloc[0]))
    # Jika kosong, balikin message biar gak error
    if top_results.empty:
        return [{"message": f"Tidak ada hasil relevan untuk query: {query}"}]

    return top_results[[
        'index', 'brand', 'name','size', 'category','processed_desc', 'processed_how_to_use', 'Similarity_Score','ingredients','image_url','price'
    ]].to_dict(orient='records')
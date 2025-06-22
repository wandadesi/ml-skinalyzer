import base64
import cv2
import numpy as np
import pytz
from app.utils.firebase import db, get_current_user
from app.utils.inference import detect_face_cleanliness
from flask import Blueprint, jsonify, request,redirect, session
from app.utils.inference import retrieve_with_mpnet
from app.utils.visualization import draw_bbox
from firebase_admin import auth as admin_auth
from datetime import datetime
import json
# Main Blueprint (untuk halaman root)
main = Blueprint("main", __name__)

@main.route("/")
def index():
    return redirect("http://localhost:5173")

api = Blueprint("api", __name__)



def sanitize(obj):
    """
    Recursively convert numpy types and other non-serializable types into
    Python built-ins so Firestore dapat menyimpannya.
    """
    # dict → sanitize setiap value
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}

    # list/tuple → sanitize setiap elemen → always list
    if isinstance(obj, (list, tuple)):
        return [sanitize(v) for v in obj]

    # numpy scalar → Python scalar
    if isinstance(obj, np.generic):
        return obj.item()

    # numpy array → list of scalars
    if isinstance(obj, np.ndarray):
        return obj.tolist()

    # datetime sudah di-handle Firestore SDK
    # str, int, float, bool dibiarkan
    return obj


# -----------------------
# Endpoint analyze
# -----------------------
@api.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    image_data = data.get("image_base64")
    user_id = data.get("user_id")

    if not image_data or not user_id:
        return jsonify({"error": "Missing image or user_id"}), 400

    # Decode base64 ke gambar
    try:
        img_bytes = base64.b64decode(image_data.split(",")[-1])
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({"error": f"Image decode failed: {e}"}), 500

    # Deteksi wajah dan kebersihan
    result = detect_face_cleanliness(image_data)
    detections = result.get("detections", [])
    print("Result from detection:", result)

    # Bangun query untuk IR
    labels = {f'"{det["label"]}"' for det in detections}
    query = " or ".join(labels) if labels else ""
    print("IR query:", query)

    # Ambil rekomendasi dari IR
    if query:
        print(">>> Memanggil model IR...")
        ir_results = retrieve_with_mpnet(query)
        print("IR results:", ir_results)
    else:
        print(">>> Query kosong, model IR dilewati.")
        ir_results = []

    # Gambar bounding box dan encode ulang ke base64
    img = draw_bbox(img, detections)
    _, buffer = cv2.imencode(".jpg", img)
    img_out_base64 = base64.b64encode(buffer).decode("utf-8")
    result["image_with_box"] = "data:image/jpeg;base64," + img_out_base64

    # Waktu Jakarta sebagai datetime object
    jakarta_time = datetime.now(pytz.timezone("Asia/Jakarta"))

        # … setelah sanitize …
    clean_result     = sanitize(result)
    clean_ir_results = sanitize(ir_results)

    # Serialisasi jadi JSON string
    result_json = json.dumps(clean_result)
    ir_results_json = json.dumps(clean_ir_results)

    db.collection("analyses").add({
        "user_id":    user_id,
        # Simpan JSON string, bukan nested dict/list
        "result":     result_json,
        "ir_query":   query,
        "ir_results": ir_results_json,
        "timestamp":  jakarta_time
    })


    return jsonify({
        # kalau client butuh dict, bisa kirim parsed JSON:
        "detection":  clean_result,
        "ir_query":   query,
        "ir_results": clean_ir_results,
        "timestamp":  jakarta_time.isoformat()
    }), 200

# @api.route("/analyze", methods=["POST"])
# def analyze():
#     data = request.json
#     image_data = data.get("image_base64")
#     user_id = data.get("user_id")

#     if not image_data or not user_id:
#         return jsonify({"error": "Missing image or user_id"}), 400

#     # Decode base64 ke gambar
#     try:
#         img_bytes = base64.b64decode(image_data.split(",")[-1])
#         nparr = np.frombuffer(img_bytes, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     except Exception as e:
#         return jsonify({"error": f"Image decode failed: {str(e)}"}), 500

#     # Deteksi wajah dan kebersihan
#     result = detect_face_cleanliness(image_data)
#     detections = result.get("detections", [])
#     print("Result from detection:", result)

#     # Bangun query untuk IR
#     labels = {f'"{det["label"]}"' for det in detections}
#     query = " or ".join(labels) if labels else ""
#     print("IR query:", query)

#     # Ambil rekomendasi dari IR
#     if query.strip():
#         print(">>> Memanggil model IR...")
#         ir_results = retrieve_with_mpnet(query)
#         print("IR results:", ir_results)
#     else:
#         print(">>> Query kosong, model IR dilewati.")
#         ir_results = []

#     # Gambar bounding box
#     img = draw_bbox(img, detections)

#     # Encode ulang ke base64
#     _, buffer = cv2.imencode(".jpg", img)
#     img_out_base64 = base64.b64encode(buffer).decode("utf-8")
#     result["image_with_box"] = "data:image/jpeg;base64," + img_out_base64

#     jakarta_time = datetime.now(pytz.timezone("Asia/Jakarta")).isoformat()

#     # Simpan ke Firestore
#     db.collection("analyses").add({
#         "user_id": user_id,
#         "result": result,
#         "ir_query": query,
#         "ir_results": ir_results,
#         "timestamp": jakarta_time

#     })

#     return jsonify({
#         "detection": result,
#         "ir_query": query,
#         "ir_results": ir_results,
#         "timestamp": datetime.now(pytz.timezone("Asia/Jakarta")).isoformat()

#     })

# --- Blueprint untuk autentikasi
auth = Blueprint("auth", __name__)
# @router.post("/recommend")
# async def recommend_products(request: Request):
#     data = await request.json()
#     labels = data.get("labels", [])
#     products = retrieve_products_mpnet(labels)
#     return {"products": products}


auth = Blueprint("auth", __name__)
import bcrypt

@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    user_id = data.get("user_id")
    password = data.get("password")
    print("Data diterima:", data)

    if not user_id or not password:
        return jsonify({"error": "Missing user_id or password"}), 400

    user_doc = db.collection("users").document(user_id).get()

    if not user_doc.exists:
        print("User tidak ditemukan")
        return jsonify({"error": "User not found"}), 404

    user_data = user_doc.to_dict()
    print("User data dari Firestore:", user_data)

    # Cek password dengan bcrypt
    hashed_password = user_data.get("password").encode("utf-8")
    if not bcrypt.checkpw(password.encode("utf-8"), hashed_password):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Login successful", "user_id": user_id})


@auth.route("/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        # Tangani preflight request dengan kosong saja
        return '', 204
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@auth.route("/protected")
def protected():
    user = get_current_user()
    if not user:
        return {"error": "Unauthorized"}, 401
    return {"message": f"Hello {user['email']}"}



# Sudah diasumsikan Firebase Admin sudah diinisialisasi sebelumnya
@api.route("/history", methods=["GET"])
def get_history():
    try:
        # Ambil token dari header dan verifikasi
        auth_header = request.headers.get("Authorization", "")
        id_token = auth_header.replace("Bearer ", "")
        decoded_token = admin_auth.verify_id_token(id_token)
        user_id = decoded_token["uid"]

        # Ambil data dari Firestore
        docs = db.collection("analyses").where("user_id", "==", user_id).stream()

        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(data)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401


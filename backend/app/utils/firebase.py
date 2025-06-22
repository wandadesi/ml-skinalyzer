import os
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials, firestore
from flask import request
from firebase_admin import firestore
from firebase_admin.firestore import SERVER_TIMESTAMP


# Load environment variables
load_dotenv()

# Inisialisasi Firebase Admin hanya sekali
if not firebase_admin._apps:
    cred = os.getenv("FIREBASE_CRED")
    if not cred:
        raise ValueError("FIREBASE_CRED is not set in .env file")

    cred_dict = json.loads(cred)

    cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")

    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)


# Firestore client
db = firestore.client()

# Helper: Ambil user dari request (bearer token dari frontend)
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    id_token = auth_header.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # berisi uid, email, dll.
    except Exception as e:
        print("Auth error:", e)
        return None

# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import bcrypt
# from app.utils.firebase import db

# def add_user(user_id, plain_password):
#     # Hash password
#     hashed_pw = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

#     # Simpan ke Firestore
#     db.collection("users").document(user_id).set({
#         "user_id": user_id,
#         "password": hashed_pw
#     })

#     print(f"User '{user_id}' berhasil ditambahkan.")

# # Contoh penggunaan
# if __name__ == "__main__":
#     add_user("wanda", "admin123")

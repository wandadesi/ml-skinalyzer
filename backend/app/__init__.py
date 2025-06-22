from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # ✅ Set secret key di sini
    app.secret_key = "supersecretkey"

    # Optional: jika pakai CORS
    CORS(app,supports_credentials=True)

    # Import Blueprint
    from .routes import api, auth, main

    # Register Blueprint
    app.register_blueprint(api)
    app.register_blueprint(auth)
    app.register_blueprint(main)

    return app

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS  # ✅ Enable CORS

import os
import hashlib
import time
import json

# Optional: Firebase imports if used later (currently not in use)
# import firebase_admin
# from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # ✅ Allow CORS from all origins (for dev); restrict later if needed

# Constants
UPLOAD_FOLDER = 'uploads'
RECORD_FILE = 'records.json'

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load previous file records
if os.path.exists(RECORD_FILE):
    with open(RECORD_FILE, 'r') as f:
        uploaded_files = json.load(f)
else:
    uploaded_files = {}

# Helper: Save records to JSON file
def save_records():
    with open(RECORD_FILE, 'w') as f:
        json.dump(uploaded_files, f)

# 📤 File Upload Endpoint
@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Calculate SHA-256 hash
    with open(filepath, 'rb') as f:
        file_bytes = f.read()
        hash_val = hashlib.sha256(file_bytes).hexdigest()

    # Save metadata with trust receipt
    trust_receipt = f"trust://{hash_val}"
    uploaded_files[hash_val] = {
        "filename": filename,
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    }

    save_records()

    return jsonify({"trustReceipt": trust_receipt})

# ✅ Trust Receipt Verification
@app.route("/verify", methods=["GET"])
def verify_receipt():
    hash_val = request.args.get("hash")
    if not hash_val:
        return jsonify({"error": "Missing hash"}), 400

    # Remove "trust://" prefix if included
    if hash_val.startswith("trust://"):
        hash_val = hash_val.replace("trust://", "")

    record = uploaded_files.get(hash_val)
    if record:
        return jsonify({
            "verified": True,
            "filename": record["filename"],
            "timestamp": record["timestamp"]
        })
    else:
        return jsonify({"verified": False, "error": "Hash not found"}), 404

# Run the app (Render will override this in production)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

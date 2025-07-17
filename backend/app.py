from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import hashlib
import time
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
RECORD_FILE = 'records.json'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load saved records if available
if os.path.exists(RECORD_FILE):
    with open(RECORD_FILE, 'r') as f:
        uploaded_files = json.load(f)
else:
    uploaded_files = {}

def save_records():
    with open(RECORD_FILE, 'w') as f:
        json.dump(uploaded_files, f)

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

    with open(filepath, 'rb') as f:
        file_bytes = f.read()
        hash_val = hashlib.sha256(file_bytes).hexdigest()

    trust_receipt = f"trust://{hash_val}"
    uploaded_files[hash_val] = {
        "filename": filename,
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    }

    save_records()

    return jsonify({"trustReceipt": trust_receipt})

@app.route("/verify", methods=["GET"])
def verify_receipt():
    hash_val = request.args.get("hash")
    if not hash_val:
        return jsonify({"error": "Missing hash"}), 400

    record = uploaded_files.get(hash_val)
    if record:
        return jsonify({
            "verified": True,
            "filename": record["filename"],
            "timestamp": record["timestamp"]
        })
    else:
        return jsonify({"verified": False, "error": "Hash not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)

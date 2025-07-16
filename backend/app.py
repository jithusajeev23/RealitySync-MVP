from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate("realitysync-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_bytes = file.read()
    reality_hash = hashlib.sha256(file_bytes).hexdigest()

    metadata = {
        "filename": file.filename,
        "reality_hash": reality_hash,
        "timestamp": datetime.utcnow().isoformat()
    }

    db.collection("realitysync").add(metadata)

    return jsonify({
        "message": "Proof stored successfully",
        "reality_hash": reality_hash,
        "verify_url": f"http://localhost:3000/verify?hash={reality_hash}"
    }), 200

@app.route("/verify/<hash>", methods=["GET"])
def verify_receipt(hash):
    try:
        docs = db.collection("realitysync").where("reality_hash", "==", hash).stream()
        for doc in docs:
            data = doc.to_dict()
            return jsonify(data), 200
        return jsonify({"error": "Receipt not found"}), 404
    except Exception as e:
        print("🔥 Verification error:", str(e))
        return jsonify({"error": "Server crashed: " + str(e)}), 500

# ✅ ADD THIS NEW ROUTE BELOW
@app.route("/receipts", methods=["GET"])
def get_receipts():
    try:
        docs = db.collection("realitysync").stream()
        result = []
        for doc in docs:
            result.append(doc.to_dict())
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Error fetching receipts: " + str(e)}), 500

# 🚀 Entry point
if __name__ == '__main__':
    app.run(debug=True)

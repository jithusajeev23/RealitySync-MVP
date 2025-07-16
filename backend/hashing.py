import hashlib

def generate_reality_hash(data: str):
    result = hashlib.sha256(data.encode())
    return result.hexdigest()

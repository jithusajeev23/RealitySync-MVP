import json

# 🔐 Read the Firebase JSON key file
with open("realitysync-key.json", "r") as f:
    data = json.load(f)

# 🔁 Convert it to a single-line JSON string with proper escaping
json_string = json.dumps(data)

# 📤 Print the string output so you can copy it
print("\n🔑 Copy the following output:\n")
print(json_string)

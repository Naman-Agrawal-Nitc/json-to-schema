# backend/server.py
from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

def generate_schema(data):
    if isinstance(data, dict):
        return {
            "type": "object",
            "properties": {key: generate_schema(value) for key, value in data.items()}
        }
    elif isinstance(data, list) and data:
        return {
            "type": "array",
            "items": generate_schema(data[0])
        }
    else:
        return {"type": type_map(data)}

def type_map(value):
    if isinstance(value, str):
        return "string"
    elif isinstance(value, int):
        return "integer"
    elif isinstance(value, float):
        return "number"
    elif isinstance(value, bool):
        return "boolean"
    elif value is None:
        return "null"
    else:
        return "object"

@app.route('/convert', methods=['POST'])
def convert_json_to_schema():
    data = request.get_json()
    try:
        schema = generate_schema(data)
        return jsonify(schema), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

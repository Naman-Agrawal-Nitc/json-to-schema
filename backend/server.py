# backend/server.py
from flask import Flask, request, jsonify, Response, send_from_directory
import json
import os

app = Flask(__name__, static_folder="build")


def gerenate_nested_schema(data, json_schema):
    schema_properties = json_schema.get("allOf")[0].get("properties")
    for key, value in data.items():
        if key != "type":
            schema_properties[key] = {
                "type": type_map(value),
                "title": "default_title",
                "description": "default_description"
            }
            check_nesting(value, schema_properties[key])


def check_nesting(object, schema):
    if not isinstance(object, dict):
        return
    schema["properties"] = {}
    schema_properties = schema.get("properties")
    for key, value in object.items():
        schema_properties[key] = {
            "type": type_map(value),
            "title": "default_title",
            "description": "default_description"
        }
        check_nesting(value, schema_properties[key])


def generate_schema(data):
    application_type = data.get("type")
    json_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "https://fdc3.finos.org/schemas/next/context/default_id.json",
        "type": "object",
        "title": "default_title",
        "description": "default_description",
        "allOf": [{"type": "object",
                   "properties": {
                       "type": {
                           "const": application_type
                       },
                   },
                   "required": [
                       "type"
                   ]}
                  ],
        "examples": [data]
    }
    gerenate_nested_schema(data, json_schema)
    json_schema.get("allOf").append({"$ref": "context.schema.json#/definitions/BaseContext"})
    return json_schema


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


def validate(data):
    if isinstance(data, dict):
        if "type" not in data or not isinstance(data.get("type"), str):
            raise Exception("type field must be present in json")

        return True
    else:
        return False


@app.route('/convert', methods=['POST'])
def convert_json_to_schema():
    data = request.get_json()
    try:
        if validate(data):
            schema = generate_schema(data)
            return Response(json.dumps(schema, sort_keys=False), mimetype='application/json'), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory("build", path)
    else:
        return send_from_directory("build", "index.html")


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
